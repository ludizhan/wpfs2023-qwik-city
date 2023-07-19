import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import AddReaction from "~/components/discussions/AddReaction";
import ReplyForm from "~/components/discussions/ReplyForm";
import { type ReplyFormType } from "~/components/discussions/ReplyForm";
import {
  REACTION_EMOJI,
  getDiscussionComments,
  getDiscussionDetails,
} from "~/lib/github/discussions";
import {
  type InitialValues,
} from '@modular-forms/qwik';

export const useDiscussion = routeLoader$(async (requestEvent) =>
  getDiscussionDetails(Number(requestEvent.params.id))
);
export const useComments = routeLoader$(async (requestEvent) =>
  getDiscussionComments(Number(requestEvent.params.id))
);
export const useFormLoader = routeLoader$<InitialValues<ReplyFormType>>(() => ({
  comment: '',
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
        <div class="reactions">
          {discussion.value.reactionGroups.map((group) => (
            <button disabled>
              {REACTION_EMOJI[group.content]}
              {group.totalCount}
            </button>
          ))}
          <AddReaction />
        </div>
        <div class="comments">
          <h2>Comments</h2>
          <ul>
            {comments.value.map((comment) => (
              <div dangerouslySetInnerHTML={comment.bodyHTML}></div>
            ))}
          </ul>
        </div>
        <ReplyForm />
      </section>
    </>
  );
});
