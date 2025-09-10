import { withAuth } from '@/hoc/with-auth'
import { UserRoleEnum } from '@/shared/constants'
import { createFileRoute } from '@tanstack/react-router'
import { TaskExecutionPage } from '@/domain/admin/tasks'

export const Route = createFileRoute('/admin/tasks/')({
  component: withAuth(TaskExecutionPage, { roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT] })
})
