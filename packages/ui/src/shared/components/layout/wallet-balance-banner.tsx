import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { AddETHModal } from "./add-eth-modal";
import { formatAmount } from "@/shared/lib/utils";
import { useLayout } from "@/context/layout-context";
import { withAuth } from "@/hoc/with-auth";
import { UserRoleEnum } from "@/shared/constants";
export function WalletBalanceBanner({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
  const { balanceStatus, isLoading } = useWalletBalance();

  const isWarning = balanceStatus === "warning";
  const isCritical = balanceStatus === "critical";

  const title =
    isWarning || isCritical
      ? "Low Wallet Balance"
      : isCritical
        ? "Critical Wallet Balance"
        : "Sufficient Balance";

  const description = isWarning
    ? "It is recommended to reload soon to avoid interruptions in blockchain operations."
    : isCritical
      ? "An interruption in blockchain operations can occur if the balance is not reloaded."
      : "The balance is used for backoffice actions that require transactions on the blockchain and for paying the gas for token swaps.";

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-full max-w-2xl">
        <div className={`px-4 py-3 mb-4 flex flex-col items-center gap-3`}>
          {isLoading && <span className="text-sm text-gray-500">Loading...</span>}

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
}, { showStatus: false, roles: [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT] });

