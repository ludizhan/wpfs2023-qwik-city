import { GitHubTokenPacket, getGitHubToken } from "./oauth";
import GITHUB_KEY from '../../../.env.private-key.pem?raw';
import { App } from "octokit";
import { requireEnv } from "../env";
import { Cookie, server$ } from "@builder.io/qwik-city";

export interface GitHubUser {
  id: number;
  login: string;
  avatarUrl: string;
  url: string;
  bio: string;
}

interface QueryVariables {
  [name: string]: unknown;
}

export async function queryUserGraphQl<T>(token: GitHubTokenPacket, query: string, parameters: QueryVariables): Promise<T> {
  const GITHUB_APP_ID = requireEnv('GITHUB_APP_ID');
  const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
  const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
  const GITHUB_REPO_OWNER = requireEnv('GITHUB_REPO_OWNER');
  const GITHUB_REPO_NAME = requireEnv('GITHUB_REPO_NAME');
  
  const app = new App({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_KEY,
    oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
  });
  
  const octokit = await app.oauth.getUserOctokit({
    token: token.access_token,
    refreshToken: token.refresh_token,
  });
  return await octokit.graphql(
    query,
    {
      ...parameters, repoOwner: GITHUB_REPO_OWNER,
      repoName: GITHUB_REPO_NAME
    },
  );
}

export async function fetchUserInfoFromAuth(token: GitHubTokenPacket): Promise<GitHubUser> {
  const user = await queryUserGraphQl(token, `
    query { 
      viewer { 
        login
        avatarUrl
      }
    }
  `, {});
  console.log({user});
  return (user as any).viewer as GitHubUser;
}

export function getAuthTokenFromCookie(cookie: Cookie) {
  const oauth = cookie.get('oauth');
  if (!oauth) {
    return;
  }
  try {
    return getGitHubToken(oauth.value);
  } catch (e: unknown) {
    console.error('User not authorized.');
  }
}

export const fetchUser = server$(async function () {
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