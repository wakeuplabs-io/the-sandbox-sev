import { useApiClient } from "./use-api-client";

export function useWalletService() {
  const client = useApiClient();

  return {
    getWalletBalance: async () => {
      const response = await client.api.wallet.balance.$get();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to fetch wallet balance");
      }

      const result = await response.json();
      return result.data;
    },
  };
}
