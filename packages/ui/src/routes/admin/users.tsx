import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "../../domain/admin/users";
import { withAuth } from "@/hoc/with-auth";
import { UserRoleEnum } from "@/shared/constants";

export const Route = createFileRoute("/admin/users")({
  component: withAuth(AdminUsersPage, { roles: [UserRoleEnum.ADMIN] }),
});
