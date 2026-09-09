import {
  PHONE_INPUT_COUNTRIES,
  getPhoneInputCountryByCode,
} from "../ui/PhoneInput/countries";

export type ParsedContactPhone = {
  iso2: string | null;
  nationalNumber: string;
  displayNumber: string;
  raw: string;
};

function formatNationalNumber(national: string): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) {
    return national;
  }

  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

function resolveCountryFromCode(countryCode: string) {
  const trimmed = countryCode.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("+")) {
    return PHONE_INPUT_COUNTRIES.find((country) => country.dialCode === trimmed);
  }

  return getPhoneInputCountryByCode(trimmed);
}

export function contactPhoneFlagUrl(iso2: string): string {
  return `https://flagcdn.com/w20/${iso2.toLowerCase()}.png`;
}

export function parseContactPhone(
  phone: string,
  phoneCountryCode?: string,
): ParsedContactPhone {
  const raw = phone.trim();
  if (!raw) {
    return { iso2: null, nationalNumber: "", displayNumber: "", raw: "" };
  }

  const normalized = raw.replace(/[\s()-]/g, "");

  if (phoneCountryCode) {
    const country = resolveCountryFromCode(phoneCountryCode);
    if (country) {
      let national = normalized;
      if (normalized.startsWith(country.dialCode)) {
        national = normalized.slice(country.dialCode.length);
      } else if (normalized.startsWith(country.dialCode.replace("+", ""))) {
        national = normalized.slice(country.dialCode.length - 1);
      }

      return {
        iso2: country.iso2,
        nationalNumber: national,
        displayNumber: formatNationalNumber(national),
        raw,
      };
    }
  }

  const sortedCountries = [...PHONE_INPUT_COUNTRIES].sort(
    (left, right) => right.dialCode.length - left.dialCode.length,
  );

  for (const country of sortedCountries) {
    if (normalized.startsWith(country.dialCode)) {
      const national = normalized.slice(country.dialCode.length);
      return {
        iso2: country.iso2,
        nationalNumber: national,
        displayNumber: formatNationalNumber(national),
        raw,
      };
    }
  }

  return {
    iso2: null,
    nationalNumber: normalized,
    displayNumber: raw,
    raw,
  };
}
