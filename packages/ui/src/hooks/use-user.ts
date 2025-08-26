import { useApiClient } from "./use-api-client";

export const useUser = () => {
  const client = useApiClient();

  const getByAddress = async (address: string, email?: string) => {
    try {
      const res = await (client.users[":address"] as any).$get({
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
  return {
    getByAddress,
  };
};
