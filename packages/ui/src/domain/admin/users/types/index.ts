import { UserRoleEnum } from "@/shared/constants";

export interface User {
 id: number;
 email: string | null;
 nickname: string | null;
 address: string;
 role: UserRoleEnum;
 createdAt: string;
}

export interface UserWithChanges extends User {
  originalRole: UserRoleEnum;
  hasChanges: boolean;
}