import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import { type GitHubUser, fetchUser } from "~/lib/github/user";

export default component$(() => {
  const user = useSignal<GitHubUser>();

  useTask$(async () => {
    user.value = await fetchUser();
  });

  return (
    <div class="container">
      <h2>Welcome to our discussions{user.value ? `, ${user.value.login}` : ''}!</h2>
      <br />
      <ul style={{ display: 'flex', flexDirection: 'column', alignContent: 'space-between', gap: '1em', listStyle: 'none' }}>
        <li>
          <Link href="/about"><button>About</button></Link>
        </li>
        <li>
          <Link href="/discussions"><button>Discussions list</button></Link>
        </li>
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
