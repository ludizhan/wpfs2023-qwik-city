import { GitHubTokenPacket } from "./oauth";
import GITHUB_KEY from '../../../.env.private-key.pem?raw';
import { App } from "octokit";
import { requireEnv } from "../env";

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
    parameters,
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
