import { component$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import AddReaction from "~/components/discussions/AddReaction";
import ReplyForm from "~/components/discussions/ReplyForm";
import { type ReplyFormType } from "~/components/discussions/ReplyForm";
import {
  REACTION_EMOJI,
  addDiscussionReaction,
  getDiscussionComments,
  getDiscussionDetails,
  reactionRequestSchema,
  removeDiscussionReaction,
} from "~/lib/github/discussions";
import { type InitialValues } from "@modular-forms/qwik";
import { GitHubTokenPacket, getGitHubToken } from "~/lib/github/oauth";

export const useDiscussion = routeLoader$(async (requestEvent) => {
  const cookie = requestEvent.cookie.get('oauth');
  let auth: GitHubTokenPacket | undefined;
  if (cookie) {
    try {
      auth = getGitHubToken(cookie.value);
    }
    catch (e: unknown) { console.error(e); }
  }
  return getDiscussionDetails(Number(requestEvent.params.id), auth);
});

export const useToggleReaction = routeAction$(async (data, event) => {
  const oauthToken = event.cookie.get('oauth');
  if (!oauthToken) {
    return;
  }
  try {
    const reactionRequest = reactionRequestSchema.parse(data);
    const githubToken = getGitHubToken(oauthToken.value);
    if (reactionRequest.viewerHasReacted) {
      console.log(`Undo reaction for ${REACTION_EMOJI[reactionRequest.content]}`);
      removeDiscussionReaction(githubToken, reactionRequest);
    } else {
      console.log(`Reacted with ${REACTION_EMOJI[reactionRequest.content]}`);
      addDiscussionReaction(githubToken, reactionRequest);
    }
  } catch (e: unknown) { console.error(e); }
});

export const useComments = routeLoader$(async (requestEvent) =>
  getDiscussionComments(Number(requestEvent.params.id))
);
export const useFormLoader = routeLoader$<InitialValues<ReplyFormType>>(() => ({
  comment: "",
}));

export default component$(() => {
  const discussion = useDiscussion();
  const comments = useComments();

  return (
    <>
      <section>
        <h1>{discussion.value.title}</h1>
        <p>
          by {discussion.value.author} on {discussion.value.createdAt}
        </p>
        <div dangerouslySetInnerHTML={discussion.value.bodyHTML} />
        <AddReaction />
        <div class="comments">
          <h2>Comments</h2>
          <ul>
            {comments.value.map((comment, index) => (
              <div dangerouslySetInnerHTML={comment.bodyHTML} key={index}></div>
            ))}
          </ul>
        </div>
        <ReplyForm />
      </section>
    </>
  );
});
