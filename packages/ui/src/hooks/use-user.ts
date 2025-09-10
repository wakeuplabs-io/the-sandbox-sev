import { UserRoleEnum } from "@/shared/constants";
import { useApiClient } from "./use-api-client";

export const useUser = () => {
  const client = useApiClient();

  const getByAddress = async (address: string, email?: string) => {
    try {
      const res = await client.api.users[":address"].$get({
        param: { address },
        ...(email && { query: { email } }),
      });
      if (!res.ok) throw new Error("Error fetching user");
      return res.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user");
    }
  };

  const getUsers = async (page: number = 1, limit: number = 10) => {
    try {
      const res = await client.api.users.$get({
        query: { page, limit },
      });
      if (!res.ok) throw new Error("Error fetching users");
      return res.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching users");
    }
  };

  const assignRoles = async (addresses: string[], role: UserRoleEnum) => {
    const res = await client.api.users.roles.assign.$post({
      json: { addresses, role },
    });
    if (!res.ok) throw new Error("Error assigning roles");
    return res.json();
  };
  
  const updateUser = async (data: { nickname: string }) => {
    const res = await client.api.users.$put({
      json: data,
    });
    if (!res.ok) throw new Error("Error updating user");
    return res.json();
  };

  const getUserByNickname = async (nickname: string) => {
    const res = await client.api.users.nickname[":nickname"].$get({
      param: { nickname },
    });
    if (!res.ok) throw new Error("Error fetching user by nickname");
    return res.json();
  };
  return {
    getByAddress,
    getUsers,
    assignRoles,
    updateUser,
    getUserByNickname,
  };
};
