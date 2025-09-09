import { UserRoleEnum } from "@/shared/constants";
import { RoleSelector } from "./role-selector";
import type { User } from "../types";
import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";
import { formatDate, truncateHash } from "@/shared/lib/utils";

interface UserRoleRowProps {
  user: User;
  onRoleChange: (userId: number, newRole: UserRoleEnum) => void;
  isCurrentUser: boolean;
}

export function UserRoleRow({ user, onRoleChange, isCurrentUser }: UserRoleRowProps) {
  
    const getDisplayName = (user: User) => {
    if (user.nickname) return user.nickname;
    if (user.email) return user.email;
    return truncateHash(user.address);
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
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm">{truncateHash(user.address)}</div>
          <CopyToClipboard text={user.address} />
        </div>
      </td>

      <td className="z-10">
        {isCurrentUser ? (
          <div className="flex items-center gap-2">
            <span className="badge badge-neutral">
              {user.role === UserRoleEnum.MEMBER ? "No Role" : user.role}
            </span>
            <span className="text-xs text-base-content/50">(You)</span>
          </div>
        ) : (
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
