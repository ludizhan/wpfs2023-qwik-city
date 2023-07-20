import { App } from "octokit";
import { requireEnv } from "../env";
import GITHUB_KEY from '../../../.env.private-key.pem?raw';
  
type GitHubAccessToken = `ghu_${string}`;
type GitHubRefreshToken = `ghr_${string}`;
type GitHubAuthorizationHeader = `${typeof GITHUB_ACCESS_TOKEN_TYPE} ${GitHubAccessToken}`;
export interface GitHubTokenPacket {
  readonly access_token: GitHubAccessToken;
  readonly expires_in: number;
  readonly refresh_token: GitHubRefreshToken;
  readonly refresh_token_expires_in: number;
  readonly scope: string;
  readonly token_type: typeof GITHUB_ACCESS_TOKEN_TYPE;
}

const GITHUB_ACCESS_TOKEN_TYPE = 'bearer';

const oauthCodeToToken = new Map<string, GitHubTokenPacket>();

export function getGitHubAuthUrl(): string {
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

export async function tradeCodeForToken(oauthCode: string) {
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token?' + new URLSearchParams({
    client_id: requireEnv('GITHUB_CLIENT_ID'),
    client_secret: requireEnv('GITHUB_CLIENT_SECRET'),
    code: oauthCode,
  }));
  const responseUrl = await tokenResponse.text();
  const parsedTokenResponse = Object.fromEntries(
    new URLSearchParams(responseUrl.slice(responseUrl.indexOf('?') + 1))
  ) as unknown as GitHubTokenPacket;
  console.log('Got auth response package:', parsedTokenResponse);
  return parsedTokenResponse;
}

export async function registerGitHubToken(oauthCode: string, githubAuthResponse: GitHubTokenPacket): Promise<void> {
  oauthCodeToToken.set(oauthCode, githubAuthResponse);
  console.log(`Registered code ${oauthCode}:`, oauthCodeToToken);
}

export function getGitHubToken(oauthCode: string): GitHubTokenPacket {
  const userAuthPackage = oauthCodeToToken.get(oauthCode);
  if (!userAuthPackage) {
    throw new Error(`No GitHub access authentication found for code ${oauthCode}.`);
  }
  return userAuthPackage;
}

export function deleteGitHubToken(oauthCode: string): boolean {
  return oauthCodeToToken.delete(oauthCode);
}

/** Fetches a registered GitHub token's `access_token` */
export function getAccessToken(oauthCode: string): GitHubAccessToken {
  return getGitHubToken(oauthCode).access_token;
}

export function getAuthorizationHeader(codeOrToken: string | GitHubAccessToken): GitHubAuthorizationHeader {
  let accessToken: GitHubAccessToken;
  if (isGitHubAccessToken(codeOrToken)) {
    accessToken = codeOrToken;
  } else {
    accessToken = getGitHubToken(codeOrToken).access_token;
  }
  return `${GITHUB_ACCESS_TOKEN_TYPE} ${accessToken}`;
}

export function isAuthorized(oauthCode: string): boolean {
  return oauthCodeToToken.has(oauthCode);
}

function isGitHubAccessToken(token: string): token is GitHubAccessToken {
  return token.startsWith('ghu_');
}