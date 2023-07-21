import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getDiscussionList } from "~/lib/github/discussions";

export const useDiscussions = routeLoader$(async () => getDiscussionList());

export default component$(() => {
  const discussions = useDiscussions();

  return (
    <main class="container">
      <h2>Discussions</h2>
      <br />
      <ul style={{ display: 'flex', flexDirection: 'column', alignContent: 'space-between', gap: '1em', listStyle: 'none' }}>
        {discussions.value.map((d) => (
          <li key={d.number}>
            <button style={{ backgroundColor: 'grey' }}>
              <Link href={"/discussions/" + d.number}>{d.title}</Link> by{" "}
              {d.author}, created: {d.createdAt}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
});
