import { App } from "octokit";
import GITHUB_KEY from '../../../.env.private-key.pem?raw';
import { requireEnv } from "../env";

export interface GitHubAccessTokenResponse {
  access_token: `ghu_${string}`;
  expires_in: number;
  refresh_token: `ghr_${string}`;
  refresh_token_expires_in: number;
  scope: string;
  token_type: 'bearer';
}
type AuthCode = string;
const authorizedUsers = new Map<AuthCode, GitHubAccessTokenResponse>();

export function getAuthUrl(): string {
  const GITHUB_APP_ID = requireEnv('GITHUB_APP_ID');
  const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
  const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
  const app = new App({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_KEY,
    oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
  });
  const res = app.oauth.getWebFlowAuthorizationUrl({});
  return res.url;
}

export async function tradeCodeForAuthPackage(code: AuthCode) {
  const tokenAuthResponse = await fetch('https://github.com/login/oauth/access_token?' + new URLSearchParams({
    client_id: requireEnv('GITHUB_CLIENT_ID'),
    client_secret: requireEnv('GITHUB_CLIENT_SECRET'),
    code,
  }));
  const responseUrl = await tokenAuthResponse.text();
  const parsedTokenAuthResponse = Object.fromEntries(
    new URLSearchParams(responseUrl.slice(responseUrl.indexOf('?') + 1))
  ) as unknown as GitHubAccessTokenResponse;
  console.log('Got auth response package:', parsedTokenAuthResponse);
  return parsedTokenAuthResponse;
}

export function registerUserAuthPackage(code: AuthCode, githubAuthResponse: GitHubAccessTokenResponse): void {
  authorizedUsers.set(code, githubAuthResponse);
  console.log(`Registered new auth package with code ${code}`, { authorizedUsers });
}

export function deleteUserAuthPackage(code: AuthCode): boolean {
  return authorizedUsers.delete(code);
}

export function getAccessToken(code: AuthCode): GitHubAccessTokenResponse['access_token'] {
  const authResponse = authorizedUsers.get(code);
  if (!authResponse) {
    throw new Error(`No GitHub access authentication found for code ${code}.`);
  }
  return authResponse.access_token;
}

export function isAuthorized(code: AuthCode): boolean {
  return authorizedUsers.has(code);
}
