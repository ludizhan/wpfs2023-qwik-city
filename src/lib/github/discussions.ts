import { z } from "@builder.io/qwik-city";
import {queryGraphQl} from './graphql';

export interface Discussion {
	id: string;
	number: number;
	title: string;
	author: string;
	createdAt: string;
}

export const REACTIONS = [
	'THUMBS_UP',
	'THUMBS_DOWN',
	'LAUGH',
	'HOORAY',
	'CONFUSED',
	'HEART',
	'ROCKET',
	'EYES'
] as const;

export const REACTION_EMOJI: Record<(typeof REACTIONS)[number], string> = {
	THUMBS_UP: '👍',
	THUMBS_DOWN: '👎',
	LAUGH: '😄',
	HOORAY: '🎉',
	CONFUSED: '😕',
	HEART: '❤️',
	ROCKET: '🚀',
	EYES: '👀'
};

export const reactionRequestSchema = z.object({
    content: z.enum(REACTIONS),
	discussionId: z.string(),
	totalCount: z.number().min(0),
	viewerHasReacted: z.boolean(),
  });

export declare type ReactionRequest = z.infer<typeof reactionRequestSchema>;

export declare type ReactionGroup = Omit<ReactionRequest, 'discussionId'>;

export interface DiscussionDetails extends Discussion {
	reactionGroups: ReactionGroup[];
	bodyHTML: string;
}

export async function getDiscussionList(): Promise<Discussion[]> {
	const body = await queryGraphQl(`
		query discussionList($repoOwner: String!, $repoName: String!) {
			repository(owner: $repoOwner, name: $repoName) {
				discussions(last: 10) {
					edges {
						node {
							number
							title
							author {
								login
							}
							createdAt
						}
					}
				}
			}
		}
	`);

	const discussions = (body as any).repository.discussions.edges.map((edge: any) => ({
		number: edge.node.number,
		title: edge.node.title,
		author: edge.node.author.login,
		createdAt: edge.node.createdAt
	}));

	return discussions;
}

export async function getDiscussionDetails(number: number): Promise<DiscussionDetails> {
	const body = await queryGraphQl(
		`
		query discussionDetails($repoOwner: String!, $repoName: String!, $number: Int!) {
			repository(owner: $repoOwner, name: $repoName) {
				discussion(number: $number) {
					id
					number
					title
					author {
					  login
					}
					createdAt
					reactionGroups {
					  content
					  reactors {
						totalCount
					  }
					  viewerHasReacted
					}
					bodyHTML
				}
			}
		}
	`,
		{ number }
	);

	const discussion = (body as any).repository.discussion;
	return {
		id: discussion.id,
		number: discussion.number,
		title: discussion.title,
		author: discussion.author.login,
		createdAt: discussion.createdAt,
		reactionGroups: discussion.reactionGroups.map((group: any) => ({
			content: group.content,
			totalCount: group.reactors.totalCount,
			viewerHasReacted: group.viewerHasReacted
		})),
		bodyHTML: discussion.bodyHTML
	};
}

export interface DiscussionComment {
	author: string;
	createdAt: string;
	bodyHTML: string;
}

export async function getDiscussionComments(number: number): Promise<DiscussionComment[]> {
	const body = await queryGraphQl(
		`
		query discussionComments($repoOwner: String!, $repoName: String!, $number: Int!) {
			repository(owner: $repoOwner, name: $repoName) {
				discussion(number: $number) {
					comments(last: 10) {
						edges {
							node {
								author {
									login
								}
								createdAt
								bodyHTML
							}
						}
					}
				}
			}
		}
	`,
		{ number }
	);

	const comments = (body as any).repository.discussion.comments.edges;
	return comments.map((comment: any) => ({
		author: comment.node.author.login,
		createdAt: comment.node.createdAt,
		bodyHTML: comment.node.bodyHTML
	}));
}

export async function addDiscussionReaction({content, discussionId}: ReactionRequest): Promise<ReactionGroup> {
	return await queryGraphQl<ReactionGroup>(
		`
		mutation addDiscussionReaction($subjectId: ID!, $content: ReactionContent!) {
			addReaction(input:{subjectId:$subjectId,content:$content}) {
				reactionGroups {
					content
					reactors {
					  totalCount
					}
					viewerHasReacted
				  }
			  }
		}
	`,
		{ subjectId: discussionId, content }
	);
}
