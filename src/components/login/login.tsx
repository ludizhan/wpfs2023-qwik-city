import { component$ } from "@builder.io/qwik";
import { GitHubLogo } from "../starter/icons/github";
import { getAuthUrl } from "~/lib/github/discussions";

const AuthUrl = getAuthUrl();

interface UserLoginButtonProps {
  loggedIn: boolean;
}

/**
 * Button to redirect a user to Github OAuth2
 */
export const Login = component$(({ loggedIn }: UserLoginButtonProps) => {
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
    <a>
      <button onClick$={() => { console.error('Sign Out Button: Implement me.') }}>Sign Out</button>
    </a>
});
