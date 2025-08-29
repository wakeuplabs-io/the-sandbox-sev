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

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}