import { createFileRoute } from '@tanstack/react-router'
import { TaskExecutionPage } from '@/domain/admin/tasks/pages/task-execution.page'
import { withAuth } from '@/hoc/with-auth'
import { UserRoleEnum } from '@/shared/constants'

export const Route = createFileRoute('/admin/tasks/execute')({
  component: withAuth(TaskExecutionPage, { roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT] }),
})
