import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  nickname: z.string(),
});
export type UpdateUser = z.infer<typeof UpdateUserSchema>;