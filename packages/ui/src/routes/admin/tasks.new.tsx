import { createFileRoute } from '@tanstack/react-router'
import { TasksNewPage } from '@/domain/admin/tasks/new'
import { withAuth } from '@/hoc/with-auth'
import { UserRoleEnum } from '@/shared/constants'

export const Route = createFileRoute('/admin/tasks/new')({
  component: withAuth(TasksNewPage, { roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT] }),
})