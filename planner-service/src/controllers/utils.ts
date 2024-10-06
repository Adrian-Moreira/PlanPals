import { Types } from 'mongoose';
import { ZodSchema } from 'zod';



export function mkZodFromMongoose<T>(
	zodSchema: ZodSchema<T>,
	mongooseDocument: any
): T {
	return zodSchema.parse({
		id: mongooseDocument._id.toString(),
		...mongooseDocument.toObject(),
	});
}

export function mkMongooseFromZod<T extends { id: string }>(
	zodObject: T
): Omit<T, 'id'> & { _id: Types.ObjectId } {
	let { id, ...attrs } = zodObject;
	return {
		_id: new Types.ObjectId(id),
		...attrs,
	};
}
