import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'
import { ObjectIdSchema } from './Planner'

const UserMongoSchema = new Schema<User>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    preferredName: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)
export const UserSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  userName: z.string(),
  preferredName: z.string(),
})
export const BasicUserSchema = UserSchema.pick({
  userName: true,
  preferredName: true,
})
export const UserCollection = 'User'
export const UserModel = mongoose.model<User>(UserCollection, UserMongoSchema)
export type User = z.infer<typeof UserSchema>
export type BasicUser = z.infer<typeof BasicUserSchema>
