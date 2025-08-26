import { useWeb3Auth } from "@/context/web3auth";
import { useState } from "react";

function SkeletonButton() {
  return (
    <div className="h-10 rounded-full bg-[#136AFC]/50 animate-pulse flex items-center justify-center font-inter text-[14px] leading-[1.43] px-4">
      <span className="">Iniciar sesión</span>
    </div>
  );
}

export const LoginButton = ({ isLoading: isLoadingUser }: { isLoading: boolean }) => {
  const {
    isLoading: isLoadingWeb3Auth,
    isInitialized,
    isAuthenticated,
    login,
    logout,
  } = useWeb3Auth();
  const [error, setError] = useState<string | null>(null);

  const isLoading = isLoadingUser || isLoadingWeb3Auth;
  const handleLogin = async () => {
    if (!isInitialized) {
      console.log("Web3Auth is not initialized yet");
      return;
    }

    setError(null);
    try {
      await login();
    } catch (e: unknown) {
      console.error("Login error:", e);
      setError(e instanceof Error ? e.message : "Error al conectar");
    }
  };

  // Si Web3Auth no está inicializado, mostramos un botón deshabilitado
  if (!isInitialized) {
    return <SkeletonButton />;
  }

  return (
    <>
      {isAuthenticated ? (
        <button onClick={() => logout()} className="btn btn-primary">Cerrar sesión</button>
      ) : isLoading ? (
        <SkeletonButton />
      ) : (
        <button onClick={handleLogin} disabled={isLoading} className="btn btn-primary">
          {"Iniciar sesión"}
        </button>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </>
  );
};
