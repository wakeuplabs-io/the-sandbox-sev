import { UserRoleEnum } from "@/shared/constants";
import { Select, SelectOption } from "@/shared/components/select";
import { FaTrash } from "react-icons/fa";

interface RoleSelectorProps {
  currentRole: UserRoleEnum;
  onChange: (newRole: UserRoleEnum) => void;
  onRemoveRole: () => void;
}

const roleOptions: SelectOption[] = [
  { value: UserRoleEnum.ADMIN, label: "Admin" },
  { value: UserRoleEnum.CONSULTANT, label: "Consultant" },
];

export function RoleSelector({ currentRole, onChange, onRemoveRole }: RoleSelectorProps) {
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as UserRoleEnum;
    onChange(newRole);
  };

  // Si tiene rol MEMBER, mostrar placeholder "No Role"
  const selectValue = currentRole === UserRoleEnum.MEMBER ? "" : currentRole;
  const placeholder = currentRole === UserRoleEnum.MEMBER ? "No Role" : undefined;

  return (
    <div className="flex items-center gap-2 w-[200px]">
      {/* Role Selector */}
      <div className="w-full">
        <Select
          value={selectValue}
          onChange={handleRoleChange}
          options={roleOptions}
          placeholder={placeholder}
          fullWidth={true}
          className="select-sm"
        />
      </div>

      {/* Remove Role Button - solo mostrar si tiene un rol asignado */}
      {currentRole !== UserRoleEnum.MEMBER && (
        <button
          onClick={onRemoveRole}
          className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content min-h-8 h-8 px-2"
          title="Remove Role"
        >
          <FaTrash className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
