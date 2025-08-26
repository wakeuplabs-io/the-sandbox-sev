import { LayoutProvider } from "@/context/layout-context";
import { Web3AuthProvider } from "@/context/web3auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProvidersWrapperProps {
  children: ReactNode;
}

const ProvidersWrapper = ({ children }: ProvidersWrapperProps) => {
  return (
    <LayoutProvider>
      <Web3AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </QueryClientProvider>
      </Web3AuthProvider>
    </LayoutProvider>
  );
};

export default ProvidersWrapper;
