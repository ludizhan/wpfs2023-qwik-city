import { queryGraphQl } from './graphql';

export async function getRepositoryDescription(): Promise<string> {
    const body = await queryGraphQl(`
		query repositoryDescription($repoOwner: String!, $repoName: String!) {
			repository(owner: $repoOwner, name: $repoName) {
				description
			}
		}
	`);

    return (body as any).repository.description;
}
