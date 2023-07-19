import { component$ } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container">
      <ul>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/discussions">Discussions list</Link></li>
      </ul>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to QwikCity starter kit",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
