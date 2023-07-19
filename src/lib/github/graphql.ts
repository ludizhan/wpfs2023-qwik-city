import { App } from 'octokit';
import GITHUB_KEY from '../../../.env.private-key.pem?raw';

function requireEnv(key: string): string {
	const value = process.env[key];
	if (value == null) {
		throw new Error(`Missing ${key} environnement variable.`);
	}

	return value;
}

interface QueryVariables {
	[name: string]: unknown;
}

export async function queryGraphQl<T>(query: string, parameters: QueryVariables = {}): Promise<T> {

	const GITHUB_APP_ID = requireEnv('GITHUB_APP_ID');
	const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
	const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
	const GITHUB_INSTALLATION_ID = Number(requireEnv('GITHUB_INSTALLATION_ID'));
	const GITHUB_REPO_OWNER = requireEnv('GITHUB_REPO_OWNER');
	const GITHUB_REPO_NAME = requireEnv('GITHUB_REPO_NAME');

	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	const octokit = await app.getInstallationOctokit(GITHUB_INSTALLATION_ID);

	return await octokit.graphql(
		query,
		Object.assign(
			{
				repoOwner: GITHUB_REPO_OWNER,
				repoName: GITHUB_REPO_NAME
			},
			parameters
		)
	);
}
