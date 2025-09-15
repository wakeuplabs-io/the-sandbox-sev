import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { truncateHash } from "@/shared/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { FaExclamationTriangle, FaWallet } from "react-icons/fa";
import { CopyToClipboard } from "../copy-to-clipboard";

export function AddETHModal() {
  const { address, network } = useWalletBalance();

  return (
    <div className="flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <FaWallet className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Add ETH to Wallet</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={address || ""}
                  size={200}
                  bgColor="white"
                  fgColor="black"
                  marginSize={1}
                />
              </div>
              <p className="text-sm text-gray-300 text-center mt-3">
                Scan the QR from your wallet to send {network?.nativeCurrency?.symbol || "ETH"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Wallet Information</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Network:</span>
                    <span className="text-white font-semibold">
                      {network?.name || "Loading..."}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Token:</span>
                    <span className="text-white font-semibold">
                      {network?.nativeCurrency?.symbol || "ETH"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-700">
                    <span className="text-sm text-gray-400 block mb-2">Wallet Address:</span>
                    <div className="flex items-center justify-between bg-gray-900 rounded p-3">
                      <span className="text-white font-mono text-sm">
                        {truncateHash(address || "")}
                      </span>
                      <CopyToClipboard text={address || ""} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-red-300 font-semibold text-sm mb-1">Important</h4>
                    <p className="text-red-200 text-xs">
                      This address only accepts {network?.nativeCurrency?.symbol || "ETH"} on the
                      {network?.name || "configured network"}. Sending from another network can
                      cause loss of funds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
