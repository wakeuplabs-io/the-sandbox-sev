import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "../../domain/admin/users";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});
