export enum Queues {
	update = "update",
	delete = "delete",
}

export interface PPObject {
	// deno-lint-ignore no-explicit-any
	data: any;
	type: string; // Object collection name
	userIds?: string[];
	plannerId?: string;
}

export interface QueueItem {
	object: PPObject;
}

export interface IQueue {
	name: Queues;
	pending: QueueItem[];
}

export const queues: IQueue[] = [
	{
		name: Queues.update,
		pending: [],
	},
	{
		name: Queues.delete,
		pending: [],
	},
];
