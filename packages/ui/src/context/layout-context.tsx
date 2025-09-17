import { createContext, ReactNode, useContext, useState } from "react";

interface LayoutContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (value: boolean) => void;
  isWalletBalanceModalOpen: boolean;
  setIsWalletBalanceModalOpen: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWalletBalanceModalOpen, setIsWalletBalanceModalOpen] = useState(false);
  return (
    <LayoutContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isWalletBalanceModalOpen,
        setIsWalletBalanceModalOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout debe usarse dentro de LayoutProvider");
  }
  return context;
}
