export function sanitizePriceValue(
  value: string,
  allowDecimals = true,
  maxDecimalPlaces = 2,
): string {
  const normalized = value.replace(/,/g, "");

  if (!allowDecimals) {
    return normalized.replace(/\D/g, "");
  }

  let cleaned = normalized.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");

  if (dotIndex === -1) {
    return cleaned;
  }

  const integerPart = cleaned.slice(0, dotIndex).replace(/\./g, "");
  const decimalPart = cleaned
    .slice(dotIndex + 1)
    .replace(/\./g, "")
    .slice(0, maxDecimalPlaces);

  return decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : `${integerPart}.`;
}

export function formatPriceValue(value: string): string {
  if (!value) {
    return "";
  }

  const [integerPart, decimalPart] = value.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (decimalPart === undefined) {
    return formattedInteger;
  }

  return `${formattedInteger}.${decimalPart}`;
}

export function parsePriceDisplay(displayValue: string): string {
  return displayValue.replace(/,/g, "");
}
