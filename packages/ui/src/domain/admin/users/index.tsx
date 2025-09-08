import { UserRoleTable } from "./components/user-role-table";
import { BatchActions } from "./components/batch-actions";
import { useAdminUsers } from "./hooks/use-admin-users";

export function AdminUsersPage() {
  const { 
    users, 
    isLoading, 
    error, 
    hasChanges, 
    saveChanges, 
    isSaving,
    changeUserRole,
    pagination,
    loadUsers,
    isCurrentUser
  } = useAdminUsers();

  if (error) {
    return (
      <div className="section">
        <div className="alert alert-error">
          <span>Error loading users: {error.message}</span>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    loadUsers(page, pagination.limit);
  };

  return (
    <section className="section">
      <div className="mb-6">
        <h1 className="heading-1">User Role Management</h1>
        <p className="text-base-content/70 mt-2">
          Manage user roles and permissions across the platform
        </p>
      </div>

      <BatchActions 
        hasChanges={hasChanges} 
        onSave={saveChanges} 
        isSaving={isSaving} 
      />

      <UserRoleTable 
        users={users} 
        isLoading={isLoading} 
        onRoleChange={changeUserRole}
        pagination={pagination}
        onPageChange={handlePageChange}
        isCurrentUser={isCurrentUser}
      />
    </section>
  );
}
