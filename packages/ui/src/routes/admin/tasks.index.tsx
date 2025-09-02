import { TasksListPage } from '@/domain/admin/tasks/pages/tasks-list.page'
import { withAuth } from '@/hoc/with-auth'
import { UserRoleEnum } from '@/shared/constants'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks/')({
  component: withAuth(TasksListPage, { roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT] })
})
