import { FaUser } from "react-icons/fa";
import { NicknameForm } from "./nickname-form";
import { NicknameSetupModalProps } from "./types";
import { CopyToClipboard } from "../copy-to-clipboard";

export function NicknameSetupModal({
  isOpen,
  user,
  onSave,
  isUpdating,
  error,
}: NicknameSetupModalProps) {
  const handleSave = async (nickname: string) => {
    await onSave(nickname);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative bg-base-100 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-xl font-bold text-base-content">Welcome to the SEV platform</h2>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-base-content/80">
              We've successfully created a unique public key for your account.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-base-content mb-2">Your address</label>
            <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1">
                <div className="font-mono text-sm text-base-content">
                  {user?.address ? formatAddress(user.address) : "Loading..."}
                </div>
              </div>
              <CopyToClipboard text={user?.address || ""} />
            </div>
          </div>

          <NicknameForm onSubmit={handleSave} isLoading={isUpdating} error={error} />
        </div>
      </div>
    </div>
  );
}
