import { component$ } from "@builder.io/qwik";
import { GitHubLogo } from "../starter/icons/github";
import { getAuthUrl } from "~/lib/github/oauth";

const AuthUrl = getAuthUrl();

/**
 * Button to redirect a user to Github OAuth2 or logout
 */
export const Login = component$(() => {
  const loggedIn = false; // TODO: Implement signal to check if authorized

  return loggedIn ?
    <a href={AuthUrl}>
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
    :
    <a href={'/logout'}>
      <button>Sign Out</button>
    </a>
});
