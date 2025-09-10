import { clsx } from "clsx";

interface ExcelInputProps {
  value: string;
  onChange: (value: string) => void;
  validationStatus: "idle" | "validating" | "valid" | "invalid";
  placeholder?: string;
}

export function ExcelInput({
  value,
  onChange,
  validationStatus,
  placeholder = "Paste your Excel data here...",
}: ExcelInputProps) {
  const getStatusText = () => {
    switch (validationStatus) {
      case "validating":
        return "Validating...";
      case "valid":
        return "Valid data";
      case "invalid":
        return "Invalid data";
      default:
        return "Paste your Excel data here";
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx("textarea textarea-bordered w-full h-64 font-mono text-sm", {
          "border-warning": validationStatus === "validating",
          "border-success": validationStatus === "valid",
          "border-error": validationStatus === "invalid",
          "border-base-300": validationStatus === "idle",
        })}
      />

      <div className="absolute top-2 right-2">
        <div
          className={clsx("badge badge-sm", {
            "badge-warning": validationStatus === "validating",
            "badge-success": validationStatus === "valid",
            "badge-error": validationStatus === "invalid",
            "badge-neutral": validationStatus === "idle",
          })}
        >
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}