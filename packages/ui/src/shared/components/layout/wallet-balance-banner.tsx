import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { AddETHModal } from "./add-eth-modal";
import { formatAmount } from "@/shared/lib/utils";
import { useLayout } from "@/context/layout-context";
import { withAuth } from "@/hoc/with-auth";
export function WalletBalanceBanner({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
  const { balanceStatus, isLoading } = useWalletBalance();

  const isWarning = balanceStatus === "warning";
  const isCritical = balanceStatus === "critical";

  const title =
    isWarning || isCritical
      ? "Saldo de Wallet Bajo"
      : isCritical
        ? "Saldo de Wallet Crítico"
        : "Saldo suficiente";

  const description = isWarning
    ? "Se recomienda recargar pronto para evitar interrupciones en operaciones de blockchain."
    : isCritical
      ? "Puede ocurrir una interrupción en las operaciones de blockchain si no se recarga el saldo."
      : "El saldo es utilizado para las acciones de backoffice que requieran transacciones en la blockchain y para pagar el gas del canje de tokens.";

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-2xl">
        <div className={`px-4 py-3 mb-4 flex flex-col items-center gap-3`}>
          {isLoading && <span className="text-sm text-gray-500">Cargando...</span>}

          <div className="flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm opacity-75 mt-1">{description}</p>
          </div>

          <AddETHModal />
        </div>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export const WalletBalance = withAuth(function WalletBalance() {
  const { setIsWalletBalanceModalOpen } = useLayout();
  const { balance, network, balanceColor } = useWalletBalance();
  return (
    <div onClick={() => setIsWalletBalanceModalOpen(true)} className="cursor-pointer">
      <span className={`text-sm ${balanceColor}`}>
        Balance: <strong>{formatAmount(balance || 0)} {network?.nativeCurrency?.symbol || "ETH"}</strong>
      </span>
    </div>
  );
}, );

