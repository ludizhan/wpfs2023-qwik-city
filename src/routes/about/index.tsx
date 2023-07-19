import { component$ } from "@builder.io/qwik";
// import { Link, routeLoader$ } from "@builder.io/qwik-city";
// import { getDiscussionList } from "~/lib/github/discussions";

// TODO(csmick): Get the GitHub repo description.
// export const useDiscussions = routeLoader$(async () => getDiscussionList());

export default component$(() => {
//   const discussions = useDiscussions();

  return (
    <main>
      <h1>About</h1>
    </main>
  );
});
