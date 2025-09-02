import { TasksIndexPage } from '@/domain/admin/tasks/tasks-index.page'
import { withAuth } from '@/hoc/with-auth'
import { UserRoleEnum } from '@/shared/constants'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks/')({
  component: withAuth(TasksIndexPage, { roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT] })
})
