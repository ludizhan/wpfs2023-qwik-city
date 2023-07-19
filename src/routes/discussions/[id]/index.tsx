import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import AddReaction from "~/components/discussions/AddReaction";
import {
  DiscussionComment,
  DiscussionCommentReply,
  REACTION_EMOJI,
  getDiscussionComments,
  getDiscussionDetails,
  getDiscussionCommentReplies,
} from "~/lib/github/discussions";

export const useDiscussion = routeLoader$(async (requestEvent) =>
  getDiscussionDetails(Number(requestEvent.params.id))
);
export const useComments = routeLoader$(async (requestEvent) =>
  getDiscussionComments(Number(requestEvent.params.id))
);

export const getCommentReplies = server$(async (id: string) => {
  return await getDiscussionCommentReplies(id);
});

function renderCommentReplies(id: string) {
  const replies = useSignal<DiscussionCommentReply[]>();

  if (!replies.value) {
    return (
      <button
        onClick$={async () => {
          replies.value = await getCommentReplies(id);
        }}
      >
        Show replies
      </button>
    );
  }
  return (
    <div class="replies-container">
      <div class="replies">
        {replies.value?.map((reply) => (
          <div>
            <p>
              by {reply.author} on {reply.createdAt}
            </p>
            <div dangerouslySetInnerHTML={reply.bodyHTML}></div>
          </div>
        ))}
      </div>
      <div class="write-reply">
        <textarea
          name="comment[body]"
          placeholder="Write a reply"
          aria-label="Comment body"
          data-required-trimmed="Text field is empty"
          dir="auto"
          required
        ></textarea>
        <button type="submit">Reply</button>
      </div>
    </div>
  );
}

function renderComment(comment: DiscussionComment) {
  return (
    <div>
      <p>
        by {comment.author} on {comment.createdAt}
      </p>
      <div dangerouslySetInnerHTML={comment.bodyHTML}></div>
      {renderCommentReplies(comment.id)}
    </div>
  );
}

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
          <div>{comments.value.map(renderComment)}</div>
        </div>
      </section>
    </>
  );
});
