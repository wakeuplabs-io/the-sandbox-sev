import { z } from 'zod'

export const RoleAssignmentSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(['ADMIN', 'CONSULTANT', 'MEMBER'])
})

export const BulkRoleAssignmentSchema = z.object({
  assignments: z.array(RoleAssignmentSchema).min(1).max(20) // Max 20 to match contract limit
})

export const RoleStatusQuerySchema = z.object({
  userIds: z.array(z.number().int().positive()).min(1).max(20)
})

export type RoleAssignment = z.infer<typeof RoleAssignmentSchema>
export type BulkRoleAssignment = z.infer<typeof BulkRoleAssignmentSchema>
export type RoleStatusQuery = z.infer<typeof RoleStatusQuerySchema>
