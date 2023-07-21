import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { REACTION_EMOJI, addDiscussionReaction, reactionRequestSchema, removeDiscussionReaction } from "~/lib/github/discussions";
import { getGitHubToken } from "~/lib/github/oauth";

import { useDiscussion } from "~/routes/discussions/[id]";

const toggleReaction = server$(function (data) {
  const reactionRequest = reactionRequestSchema.parse(data);
  const oauthToken = this.cookie.get('oauth');
  if (!oauthToken) {
    return;
  }
  try {
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

export default component$(() => {
  useStylesScoped$(`
        .reactions {
            display: inline-block;
            position: relative;
        }

        .reactions > button.viewerHasReacted {
          background-color: purple;
        } 
  `);

  const discussion = useDiscussion();

  return (
    <div class="reactions">
      {discussion.value.reactionGroups.map((group) => (
        <button
          class={{ viewerHasReacted: group.viewerHasReacted }}
          onClick$={async () => {
            await toggleReaction({
              ...group,
              discussionId: discussion.value.id,
            });
          }}
          key={group.content}
        >
          {REACTION_EMOJI[group.content]}
          {group.totalCount}
        </button>
      ))}
    </div>
  );
});
