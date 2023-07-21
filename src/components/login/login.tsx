import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { GitHubLogo } from "../starter/icons/github";
import { getGitHubAuthUrl, getGitHubToken } from "~/lib/github/oauth";
import { server$ } from "@builder.io/qwik-city";
import { type GitHubUser, fetchUserInfoFromAuth } from "~/lib/github/user";

const fetchUser = server$(async function () {
  console.log("FETCHUSER CALLED");
  const oauth = this.cookie.get("oauth");
  if (!oauth) {
    return;
  }

  let token;
  try {
    token = getGitHubToken(oauth.value);
  } catch (e: unknown) {
    return;
  }

  return fetchUserInfoFromAuth(token);
});

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
