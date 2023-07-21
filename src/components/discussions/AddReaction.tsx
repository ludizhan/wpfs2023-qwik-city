import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { REACTION_EMOJI } from "~/lib/github/discussions";

import { useDiscussion, useToggleReaction } from "~/routes/discussions/[id]";

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
  const toggleReaction = useToggleReaction();

  return (
    <div class="reactions">
      {discussion.value.reactionGroups.map((group) => (
        <button
          class={{ viewerHasReacted: group.viewerHasReacted }}
          style={{ margin: '4px' }}
          onClick$={() => {
            toggleReaction.submit({
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
