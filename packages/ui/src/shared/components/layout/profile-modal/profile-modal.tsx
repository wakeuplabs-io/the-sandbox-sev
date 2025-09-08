import { FaTimes, FaSignOutAlt, FaCopy } from "react-icons/fa";
import { ProfileModalProps } from "./types";
import { CopyToClipboard } from "../../copy-to-clipboard";
import { truncateHash } from "@/shared/lib/utils";
import { Avatar } from "../../avatar";

export function ProfileModal({
  isOpen,
  onClose,
  user,
  onLogout,
  isLoggingOut = false,
}: ProfileModalProps) {
  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await onLogout();
      onClose();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const displayName = user.nickname || user.email || "Unknown User";
  const displayNickname = user.nickname || "No nickname set";
  const displayAddress = truncateHash(user.address);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Profile</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" disabled={isLoggingOut}>
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <Avatar name={displayName} />
          <div className="text-center space-y-2">
            <h4 className="text-xl font-semibold">{displayName}</h4>

            <div className="flex items-center justify-between gap-2 text-left">
              <span className="text-sm text-base-content/70">Nickname:</span>
              <span className="font-mono text-sm bg-base-200 px-2 py-1 rounded">
                @{displayNickname}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-left">
              <span className="text-sm text-base-content/70">Address:</span>
              <div className="flex items-center">
                <CopyToClipboard text={user.address} />
                <span className="font-mono text-sm bg-base-200 px-2 py-1 rounded">
                  {displayAddress}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-left">
              <span className="text-sm text-base-content/70">Email:</span>
              <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">{user.email}</span>
            </div>
          </div>

          <button onClick={handleLogout} disabled={isLoggingOut} className="btn btn-outline btn-wide">
            {isLoggingOut ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FaSignOutAlt className="h-4 w-4" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
