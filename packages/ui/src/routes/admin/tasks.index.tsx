import { TasksIndexPage } from '@/domain/admin/tasks/tasks-index.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks/')({
  component: TasksIndexPage
})
