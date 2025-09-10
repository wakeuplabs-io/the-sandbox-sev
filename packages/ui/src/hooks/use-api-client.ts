import { useWeb3Auth } from "@/context/web3auth";
import envParsed from "@/env-parsed";
import { AppType } from "@the-sandbox-sev/api";
import { hc } from "hono/client";
import { useMemo } from "react";

export const useApiClient = () => {
  const { idToken } = useWeb3Auth();

  const client = useMemo(() => {
    const options = {
      headers: {
        "Bypass-Tunnel-Reminder": "true",
        Authorization: `Bearer ${idToken}`,
        "ngrok-skip-browser-warning": "true",
      },
    };
    return hc<AppType>(envParsed.API_URL, options);
  }, [idToken]);

  return client;
};
