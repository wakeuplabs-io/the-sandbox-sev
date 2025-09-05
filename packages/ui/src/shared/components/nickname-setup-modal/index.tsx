import { useState } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { NicknameForm } from "./nickname-form";
import { NicknameSetupModalProps } from "./types";

export function NicknameSetupModal({
  isOpen,
  user,
  onSave,
  isLoading,
  isUpdating,
  error,
}: NicknameSetupModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (nickname: string) => {
    setIsSaving(true);
    try {
      await onSave(nickname);
    } catch (error) {
      console.error("Error saving nickname:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <div className="relative bg-base-100 rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-xl font-bold text-base-content">
            Welcome to the SEV platform
          </h2>
          {/* No close button - modal cannot be dismissed until nickname is set */}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          <div className="mb-6">
            <p className="text-base-content/80">
              We've successfully created a unique public key for your account.
            </p>
          </div>

          {/* Address Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-base-content mb-2">
              Your address
            </label>
            <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-mono text-sm text-base-content">
                  {user?.address ? formatAddress(user.address) : "Loading..."}
                </div>
                <div className="text-xs text-base-content/60">
                  {user?.email || "No email provided"}
                </div>
              </div>
            </div>
          </div>

          {/* Nickname Form */}
          <NicknameForm
            onSubmit={handleSave}
            isLoading={isSaving || isUpdating}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
