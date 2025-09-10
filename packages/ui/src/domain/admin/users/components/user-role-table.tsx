import { UserRoleRow } from "./user-role-row";
import type { UserWithChanges } from "../types";
import { UserRoleEnum } from "@/shared/constants";
import { PaginationActions } from "@/shared/components/pagination-actions";
import { FaSpinner } from "react-icons/fa";

interface UserRoleTableProps {
  users: UserWithChanges[];
  isLoading: boolean;
  onRoleChange: (userId: number, newRole: UserRoleEnum) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  isCurrentUser: (user: UserWithChanges) => boolean;
}

export function UserRoleTable({
  users,
  isLoading,
  onRoleChange,
  pagination,
  onPageChange,
  isCurrentUser,
}: UserRoleTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/50 text-lg">No users found</div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden ">
      <div className="overflow-x-auto min-h-[50vh]">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th className="font-semibold">User</th>
              <th className="font-semibold">Address</th>
              <th className="font-semibold">Role</th>
              <th className="font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserRoleRow
                key={user.id}
                user={user}
                onRoleChange={onRoleChange}
                isCurrentUser={isCurrentUser(user)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && (
        <div className="p-4 border-t border-base-300">
          <PaginationActions
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            onPageChange={onPageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onNextPage={() => onPageChange(pagination.page + 1)}
            onPrevPage={() => onPageChange(pagination.page - 1)}
          />
        </div>
      )}
    </div>
  );
}
