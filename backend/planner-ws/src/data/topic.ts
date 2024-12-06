export type MessageTopicType = "planners" | "planner" | "shoppingLists" | "shoppingList" | "inbox";
export interface MessageTopic {
	type: MessageTopicType;
	id: string; // userId | plannerId | userId
}

/**
 * Parses a topic string into a Topic object.
 *
 * The topic string is expected to be a colon-separated string of the form
 * "type:id". The type must be one of the MessageTopicType values.
 *
 * If the topic string is not valid, this function returns null.
 *
 * @param {string} topicStr The topic string to parse.
 * @returns {Topic|null} A Topic object if the string is valid, null otherwise.
 */
export const mkTopic = (topicStr: string): Topic | null => {
	const topic = topicStr.split(":", 2);
	const parsedType = topic[0] as MessageTopicType;
	if (parsedType) {
		return new Topic({ type: parsedType, id: topic[1] });
	}
	return null;
};

export class Topic implements MessageTopic {
	type: MessageTopicType;
	id: string;
	constructor({ type, id }: { type: MessageTopicType; id: string }) {
		this.type = type;
		this.id = id;
	}

	equals(other: MessageTopic): boolean {
		if (other == null) return false;
		return this.type === other.type && this.id === other.id;
	}
	static equals(
		a: MessageTopic | null | undefined,
		b: MessageTopic | null | undefined,
	): boolean {
		if (!a || !b) return false;
		if (a === b) return true;
		return a.type === b.type && a.id === b.id;
	}
	toString(): string {
		return `${this.type}:${this.id}`;
	}
}
