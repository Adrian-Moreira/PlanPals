import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'
const UserMongoSchema = new Schema<User>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    preferredName: {
      type: String,
      required: true,
    },
    // createdAt: {
    //   type: String,
    //   required: true,
    //   default: () => new Date().toISOString(),
    // },
    // updatedAt: {
    //   type: String,
    //   required: true,
    //   default: () => new Date().toISOString(),
    // },
  },
  {
    timestamps: true,
  },
)
export const UserSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userName: z.string(),
  preferredName: z.string(),
})
export const BasicUserSchema = UserSchema.pick({
  userName: true,
  preferredName: true,
})
export const UserModel = mongoose.model<User>('User', UserMongoSchema)
export type User = z.infer<typeof UserSchema>
