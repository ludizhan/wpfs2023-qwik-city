import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getRepositoryDescription } from "~/lib/github/description";

export const useRepositoryDescription = routeLoader$(async () =>
  getRepositoryDescription()
);

export default component$(() => {
  const description = useRepositoryDescription();

  return (
    <main class="container">
      <h1>About</h1>
      <p style={{fontSize: '2em'}}>{description}</p>
      <p>Statically generated {':)'}</p>
    </main>
  );
});
