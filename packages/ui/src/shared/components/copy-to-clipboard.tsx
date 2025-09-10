import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";

interface CopyToClipboardProps {
  text: string;
  copiedLabel?: string;
  resetDelay?: number;
  className?: string;
  title?: string;
}

export function CopyToClipboard({
  text,
  copiedLabel = "¡Copiado!",
  resetDelay = 1500,
  className = "",
  title = "Copiar",
}: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), resetDelay);
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onClick={handleCopy}
        title={title}
        className="btn btn-xs btn-ghost text-zinc-300 hover:text-accent px-2 rounded-full flex items-center justify-center"
      >
        <FaRegCopy size={16} />
      </div>
      {isCopied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-accent text-xs text-black px-2 py-1 rounded shadow z-10 whitespace-nowrap">
          {copiedLabel}
        </span>
      )}
    </div>
  );
}
