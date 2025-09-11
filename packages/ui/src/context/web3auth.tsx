import envParsed from "@/env-parsed";
import { CHAIN_BY_ENV, W3A_CHAINS_BY_ENV, ETHERSCAN_BY_CHAIN_ID } from "@/shared/constants";
import { retry } from "@/shared/lib/utils";
import { Web3Auth, WEB3AUTH_NETWORK_TYPE } from "@web3auth/modal";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  PublicClient,
  WalletClient,
} from "viem";

const chain = CHAIN_BY_ENV[envParsed.NODE_ENV];
const w3aChain = W3A_CHAINS_BY_ENV[envParsed.NODE_ENV];


type UserInfo = {
  email: string;
  name: string;
  profileImage: string;
  aggregateVerifier: string;
  verifier: string;
  verifierId: string;
  typeOfLogin: string;
};

interface Web3AuthState {
  web3auth: Web3Auth | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  idToken: string | null;
  walletClient: WalletClient | null;
  publicClient: PublicClient | null;
  account: `0x${string}` | null;
  email: string | null;
  chain: Chain;
  etherscanUrl: string;
  initError: string | null;
  ensureChain: () => Promise<boolean>;
}

const Web3AuthContext = createContext<Web3AuthState | null>(null);

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [account, setAccount] = useState<`0x${string}` | null>(null);

  const checkAndUpdateAuthState = async (instance: Web3Auth): Promise<boolean> => {
    if (instance.connected) {
      try {
        const userInfo = await instance.getUserInfo();
        const idToken = await instance.getIdentityToken();
        setUser(userInfo as UserInfo);
        setIdToken(idToken.idToken);
        setIsAuthenticated(true);
        console.debug("Auth state updated: user authenticated");
        return true;
      } catch (error: unknown) {
        console.error("Error checking auth state:", error);
        setUser(null);
        setIdToken(null);
        setIsAuthenticated(false);
        setAccount(null);
        return false;
      }
    }
    setUser(null);
    setIdToken(null);
    setIsAuthenticated(false);
    setAccount(null);
    console.debug("Auth state updated: user not authenticated");
    return false;
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const clientId = envParsed.WEB3AUTH_CLIENT_ID;
        if (!clientId || clientId.trim() === "") {
          throw new Error("Web3Auth client ID is missing or empty");
        }

        console.debug("Initializing Web3Auth with client ID:", clientId.substring(0, 10) + "...");
        console.debug("Chain configuration:", {
          chainId: chain.id,
          chainName: chain.name,
          rpcUrl: chain.rpcUrls.default.http[0],
        });

        // Create base configuration
        const baseConfig = {
          modalConfig: {
            connectors: {
              metamask: {
                label: "metamask",
                showOnModal: false,
              },
              auth: {
                label: "auth",
                showOnModal: true,
              },
            },
          },
          clientId,
          web3AuthNetwork: w3aChain as WEB3AUTH_NETWORK_TYPE,
          defaultChainId: `0x${chain.id.toString(16)}`,
          chains: [
            {
              chainNamespace: "eip155" as const,
              chainId: `0x${chain.id.toString(16)}`,
              rpcTarget: chain.rpcUrls.default.http[0],
              blockExplorerUrl: chain?.blockExplorers?.default.url ?? "",
              ticker: chain.nativeCurrency.symbol,
              logo: "",
              tickerName: chain.nativeCurrency.name,
              displayName: chain.name,
            },
          ],
        };

        const web3authInstance = new Web3Auth({
          ...baseConfig,
          uiConfig: {
            appName: "The Sandbox",
            logoLight: "/logo.png",
            logoDark: "/logo.png",
          },
        });

        console.debug("Web3Auth instance created, initializing...");
        await web3authInstance.init();
        console.debug("Web3Auth initialized successfully");
        setWeb3auth(web3authInstance);
        setIsInitialized(true);
        setInitError(null);

        // Use the retry helper to check for an existing session
        await retry(() => checkAndUpdateAuthState(web3authInstance), {
          retries: 5,
          delayMs: 1000,
        });
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        setInitError(error instanceof Error ? error.message : "Unknown error");

        // Provide more specific error information
        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch")) {
            console.error(
              "Network error: Unable to connect to Web3Auth servers. Check your internet connection."
            );
          } else if (error.message.includes("client ID")) {
            console.error(
              "Configuration error: Check your VITE_WEB3AUTH_CLIENT_ID environment variable."
            );
          } else if (error.message.includes("CORS")) {
            console.error("CORS error: Check your domain configuration in Web3Auth dashboard.");
          } else if (error.message.includes("No contracts found")) {
            console.error(
              "Account Abstraction error: The current chain does not support Account Abstraction v1.3.0. " +
                "This is expected for Polygon Network"
            );
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      throw new Error("Web3Auth not initialized");
    }
    try {
      setIsLoading(true);
      await web3auth.connect();
      // Use the retry helper for a better UX after connecting.
      const success = await retry(() => checkAndUpdateAuthState(web3auth), {
        retries: 5,
        delayMs: 1000,
      });
      if (!success) {
        console.warn("Could not verify connection after login.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    try {
      setIsLoading(true);
      console.debug("Logging out user");
      await web3auth.logout();
      setUser(null);
      setIdToken(null);
      setIsAuthenticated(false);
      setAccount(null);
      console.debug("Logout completed successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const client = useMemo(() => {
    if (!web3auth?.provider || !isAuthenticated) return null;
    try {
      return createWalletClient({
        chain: chain,
        transport: custom(web3auth.provider as any),
      });
    } catch (error) {
      console.error("Error creating initial wallet client:", error);
      return null;
    }
  }, [web3auth?.provider, isAuthenticated, chain]);

  // Function to ensure we're on the correct chain
  const ensureChain = async () => {
    if (!web3auth?.provider) {
      console.debug("ensureChain: No Web3Auth provider available");
      return false;
    }
    try {
      console.debug("ensureChain: Checking current chain");
      // Get current chain ID
      const currentChainId = (await web3auth.provider.request({ method: "eth_chainId" })) as string;
      const expectedChainId = `0x${chain.id.toString(16)}`;
      console.debug("ensureChain: Chain comparison", {
        current: currentChainId,
        expected: expectedChainId,
        chainId: chain.id,
        chainName: chain.name,
      });

      if (currentChainId === expectedChainId) {
        console.debug("ensureChain: Already on correct chain");
        return true;
      }
      console.debug("ensureChain: Switching to correct chain");
      try {
        await web3auth.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: expectedChainId }],
        });
        console.debug("ensureChain: Successfully switched to correct chain");
        return true;
      } catch (switchError: any) {
        // If the chain is not added, add it
        if (switchError.code === 4902) {
          console.debug("ensureChain: Chain not found, adding it");
          try {
            await web3auth.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: expectedChainId,
                  chainName: chain.name,
                  nativeCurrency: {
                    name: chain.nativeCurrency.name,
                    symbol: chain.nativeCurrency.symbol,
                    decimals: chain.nativeCurrency.decimals,
                  },
                  rpcUrls: chain.rpcUrls.default.http,
                  blockExplorerUrls: chain.blockExplorers?.default.url
                    ? [chain.blockExplorers.default.url]
                    : [],
                },
              ],
            });
            console.debug("ensureChain: Successfully added and switched to correct chain");
            return true;
          } catch (addError) {
            console.error("ensureChain: Failed to add chain", addError);
            return false;
          }
        } else {
          console.error("ensureChain: Failed to switch chain", switchError);
          return false;
        }
      }
    } catch (error) {
      console.error("ensureChain: Error checking/switching chain", error);
      return false;
    }
  };

  const walletClient = useMemo(() => {
    if (!web3auth?.provider || !account) {
      console.debug("Cannot create wallet client:", {
        hasProvider: !!web3auth?.provider,
        hasAccount: !!account,
        account,
      });
      return null;
    }

    // Validate account format
    if (!account.startsWith("0x") || account.length !== 42) {
      console.error("Invalid account format:", account);
      return null;
    }

    try {
      const client = createWalletClient({
        chain: chain,
        transport: custom(web3auth?.provider as any),
        account: account,
      });
      return client;
    } catch (error) {
      console.error("Error creating wallet client:", error);
      return null;
    }
  }, [web3auth?.provider, account]);

  const publicClient = useMemo(() => {
    if (!web3auth?.provider) return null;
    try {
      return createPublicClient({
        chain: chain,
        transport: custom(web3auth?.provider as any),
      });
    } catch (error) {
      console.error("Error creating public client:", error);
      return null;
    }
  }, [web3auth?.provider]);

  useEffect(() => {
    const getAddresses = async () => {
      if (client) {
        try {
          const addresses = await client.getAddresses();
          const [account] = addresses;
          if (account) {
            // Validate account format
            if (account.startsWith("0x") && account.length === 42) {
              console.debug("Setting valid account:", account);
              setAccount(account);
            } else {
              console.error("Invalid account format received:", account);
              setAccount(null);
            }
          } else {
            console.warn("No account found in wallet client");
            setAccount(null);
          }
        } catch (error) {
          console.error("Error getting addresses:", error);
          setAccount(null);
        }
      } else {
        console.debug("No client available, setting account to null");
        setAccount(null);
      }
    };
    getAddresses();
  }, [client, chain.id, publicClient]);

  // Reset account and pubKey when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.debug("User not authenticated, resetting account and pubKey");
      setAccount(null);
    }
  }, [isAuthenticated]);

  return (
    <Web3AuthContext.Provider
      value={{
        web3auth,
        isLoading,
        isInitialized: isInitialized,
        isAuthenticated,
        user,
        login,
        logout,
        idToken,
        walletClient: walletClient,
        account,
        publicClient: publicClient,
        email: user?.email ?? null,
        chain,
        etherscanUrl: ETHERSCAN_BY_CHAIN_ID[chain.id],
        initError,
        ensureChain,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};
