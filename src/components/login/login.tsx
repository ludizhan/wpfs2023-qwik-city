import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { GitHubLogo } from "../starter/icons/github";
import { getGitHubAuthUrl } from "~/lib/github/oauth";
import { type GitHubUser, fetchUser } from "~/lib/github/user";

/**
 * Button to redirect a user to Github OAuth2 or logout
 */
export const Login = component$(() => {
  const user = useSignal<GitHubUser>();

  useTask$(async () => {
    user.value = await fetchUser();
  });

  return (
    <a href={user.value ? "/logout" : getGitHubAuthUrl()}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "space-between",
          gap: "1em",
          maxHeight: "4em",
        }}
      >
        <div>
          {user.value ? `Log out of ${user.value.login}` : "Login with GitHub"}
        </div>
        <div>
          {user.value ? (
            <img
              src={user.value.avatarUrl}
              alt=""
              style={{ borderRadius: "50%", width: "40px", height: "40px" }}
            />
          ) : (
            <GitHubLogo height={25} width={25} />
          )}
        </div>
      </button>
    </a>
  );
});
