import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { REACTION_EMOJI } from "~/lib/github/discussions";

import { useDiscussion } from "~/routes/discussions/[id]";

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
        <button class={{viewerHasReacted: group.viewerHasReacted}} onClick$={() => { console.log(`Reacted with ${REACTION_EMOJI[group.content]}`) }} key={group.content}>
          {REACTION_EMOJI[group.content]}
          {group.totalCount}
        </button>
      ))}
    </div>
  );
});
