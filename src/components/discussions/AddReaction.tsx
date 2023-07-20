import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { REACTION_EMOJI } from "~/lib/github/discussions";

import { useDiscussion } from "~/routes/discussions/[id]";

export default component$(() => {
  useStylesScoped$(`
        .reactions {
            display: inline-block;
            position: relative;
        }
        
        dialog {
            left: calc(100% + 0.3em);
            top: 0;
            white-space: nowrap;
            border: 1px solid var(--color-bg-1);
            border-radius: 0.5em;
            padding: 0.3em;
        }    
  `);

  const discussion = useDiscussion();

  return (
    <div class="reactions">
      {discussion.value.reactionGroups.map((group) => (
        <button onClick$={() => { console.log(`Reacted with ${REACTION_EMOJI[group.content]}`) }} key={group.content}>
          {REACTION_EMOJI[group.content]}
          {group.totalCount}
        </button>
      ))}
    </div>
  );
});
