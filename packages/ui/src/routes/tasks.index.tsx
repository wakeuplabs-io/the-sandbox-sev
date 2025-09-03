import { createFileRoute } from '@tanstack/react-router'
import { TasksListPage } from '@/domain/tasks'

export const Route = createFileRoute('/tasks/')({
  component: TasksListPage,
})
