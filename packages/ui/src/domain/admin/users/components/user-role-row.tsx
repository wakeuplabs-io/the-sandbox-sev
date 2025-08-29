import { UserRoleEnum } from "@/shared/constants";
import { RoleSelector } from "./role-selector";
import type { User } from "../types";

interface UserRoleRowProps {
  user: User;
  onRoleChange: (userId: number, newRole: UserRoleEnum) => void;
  isCurrentUser: boolean;
}

export function UserRoleRow({ user, onRoleChange, isCurrentUser }: UserRoleRowProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getDisplayName = (user: User) => {
    if (user.nickname) return user.nickname;
    if (user.email) return user.email;
    return formatAddress(user.address);
  };

  const handleRemoveRole = () => {
    // Remover rol es equivalente a asignar MEMBER
    onRoleChange(user.id, UserRoleEnum.MEMBER);
  };

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-10 rounded-full">
              <span className="text-lg">{getDisplayName(user).charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div>
            <div className="font-medium">{getDisplayName(user)}</div>
            {user.email && <div className="text-sm text-base-content/70">{user.email}</div>}
          </div>
        </div>
      </td>

      <td>
        <div className="font-mono text-sm">{formatAddress(user.address)}</div>
      </td>

      <td className="z-10">
        {isCurrentUser ? (
          // Usuario actual: mostrar rol sin poder editarlo
          <div className="flex items-center gap-2">
            <span className="badge badge-neutral">
              {user.role === UserRoleEnum.MEMBER ? "No Role" : user.role}
            </span>
            <span className="text-xs text-base-content/50">(You)</span>
          </div>
        ) : (
          // Otros usuarios: selector editable
          <RoleSelector
            currentRole={user.role}
            onChange={(newRole: UserRoleEnum) => onRoleChange(user.id, newRole)}
            onRemoveRole={handleRemoveRole}
          />
        )}
      </td>

      <td>
        <div className="text-sm text-base-content/70">{formatDate(user.createdAt)}</div>
      </td>
    </tr>
  );
}
