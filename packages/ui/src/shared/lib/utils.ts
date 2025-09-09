const delay = (ms: number) => {
  console.log(`[Delay] Starting a ${ms}ms wait...`);
  return new Promise(resolve =>
    setTimeout(() => {
      console.log(`[Delay] Finished ${ms}ms wait.`);
      resolve(undefined);
    }, ms)
  );
};

type RetryOptions = {
  retries: number;
  delayMs: number;
};

/**
 * Retries an async function until it returns a truthy value or the max retries are reached.
 * @param fn The async function to retry. It should return a truthy value on success.
 * @param options Configuration for retries and delay.
 * @returns The truthy result from `fn` if successful, `undefined` otherwise.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T | undefined> {
  let lastError: unknown;
  for (let i = 0; i < options.retries; i++) {
    try {
      const result = await fn();
      if (result) {
        console.log("Retry successful");
        return result; // Success
      }
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
    }
    // Don't wait after the last attempt
    if (i < options.retries - 1) {
      console.log("Waiting before next attempt...");
      await delay(options.delayMs);
    }
  }
  console.error("All retries failed.", lastError);
  return undefined;
}

/**
 * Formatea un monto numérico a string con separador decimal y punto como separador de miles.
 * Ejemplo con showMinimumDigits=false: 1234.5 => '1.234,50'
 * Ejemplo con showMinimumDigits=true: 1234.5 => '1.234,5'
 */
export function formatAmount(
  value: number | string,
  fractionDigits = 2,
  showMinimumDigits = false
): string {
  const number = isNaN(Number(value)) ? 0 : Number(value);
  return number.toLocaleString("es-AR", {
    minimumFractionDigits: showMinimumDigits ? 0 : fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Splits a formatted amount string into integer and decimal parts.
 * @param formattedAmount - The formatted amount string (e.g., "1.234,50")
 * @returns Object with integerPart and decimalPart
 *
 * Examples:
 * - "1.234,50" => { integerPart: "1.234", decimalPart: "50" }
 * - "1.234" => { integerPart: "1.234", decimalPart: "" }
 * - "1.234,5" => { integerPart: "1.234", decimalPart: "5" }
 */
export function splitAmount(formattedAmount: string): {
  integerPart: string;
  decimalPart: string;
} {
  // Split by comma (decimal separator in es-AR locale)
  const parts = formattedAmount.split(",");

  return {
    integerPart: parts[0] || "",
    decimalPart: parts[1] || "",
  };
}

// Helper para truncar el hash
export const truncateHash = (hash: string, start = 4, end = 4) => {
  if (!hash || hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
};

/**
 * Formatea una fecha ISO a string con fecha y hora localizada.
 * @param isoString - String ISO de la fecha (ej: "2024-01-15T14:30:25.123Z")
 * @param options - Opciones de formato
 * @returns String formateado (ej: "15/01/2024, 11:30:25")
 */
export function formatDateWithTime(
  isoString: string,
  options: {
    showSeconds?: boolean;
    timeZone?: string;
  } = {}
): string {
  const { showSeconds = true, timeZone = "America/Argentina/Buenos_Aires" } = options;

  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", isoString);
      return isoString; // Return original if invalid
    }

    return date.toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: showSeconds ? "2-digit" : undefined,
      timeZone,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoString; // Return original if error
  }
}

/**
 * Formatea una fecha ISO a string con solo fecha (sin hora).
 * @param isoString - String ISO de la fecha
 * @returns String formateado (ej: "15/01/2024")
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", isoString);
      return isoString;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoString;
  }
}
