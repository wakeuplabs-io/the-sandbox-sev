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
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <span>Error loading users: {error.message}</span>
        </div>
      </div>
    );
  }

  console.log("pagination", pagination);
  const handlePageChange = (page: number) => {
    loadUsers(page, pagination.limit);
  };

  return (
    <section className="container mx-auto p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Role Management</h1>
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
