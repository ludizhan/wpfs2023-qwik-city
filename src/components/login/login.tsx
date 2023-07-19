import { component$ } from "@builder.io/qwik";
import { GitHubLogo } from "../starter/icons/github";
import { GitHubOAuthLink } from "~/lib/github/oauth";

/**
 * Button to redirect a user to Github OAuth2
 */
export const Login = component$(() => {
  return (
    <a href={GitHubOAuthLink}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1em",
        }}
      >
        <div>Login with GitHub</div>
        <div>
          <GitHubLogo height={25} width={25} />
        </div>
      </button>
    </a>
  );
});
