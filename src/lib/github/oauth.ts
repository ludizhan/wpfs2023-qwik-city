export const GitHubOAuthLink = new URL(
  'https://github.com/login/oauth/authorize?' +
  new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
  }).toString(),
).toString();
console.log({GitHubOAuthLink});
