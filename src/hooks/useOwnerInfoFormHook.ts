"use client";

import { useCallback, useRef, useState } from "react";
import type {
  OwnerInfoFormValues,
  OwnerInfoItem,
} from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { OwnerInfoFormValues, OwnerInfoItem };

export type OwnerFieldErrors = Partial<Record<keyof OwnerInfoItem, string>>;
export type OwnerFieldTouched = Partial<Record<keyof OwnerInfoItem, boolean>>;

export const DEFAULT_OWNER_COUNTRY_CODE = "+962";

export const OWNER_INFO_REQUIRED_FIELDS = [
  "owner_name",
  "phone_number",
  "email",
] as const satisfies readonly (keyof OwnerInfoItem)[];

export const emptyOwnerInfoItem: OwnerInfoItem = {
  owner_name: "",
  country_code: DEFAULT_OWNER_COUNTRY_CODE,
  phone_number: "",
  email: "",
  social_security_id: "",
  nationality: "",
  owner_address: "",
  owner_documents: [],
};

export function hasOwnerInfoContent(owner: OwnerInfoItem): boolean {
  if (owner.owner_documents.length > 0) {
    return true;
  }

  return (
    owner.owner_name.trim() !== "" ||
    owner.phone_number.trim() !== "" ||
    owner.email.trim() !== "" ||
    owner.social_security_id.trim() !== "" ||
    owner.nationality.trim() !== "" ||
    owner.owner_address.trim() !== "" ||
    (owner.country_code.trim() !== "" &&
      owner.country_code !== DEFAULT_OWNER_COUNTRY_CODE)
  );
}

export function filterOwnersWithContent(
  owners: OwnerInfoItem[],
): OwnerInfoItem[] {
  return owners.filter(hasOwnerInfoContent);
}

export function validateOwnerFieldErrors(
  owner: OwnerInfoItem,
): OwnerFieldErrors {
  const fieldErrors: OwnerFieldErrors = {};

  if (!owner.owner_name.trim()) {
    fieldErrors.owner_name = "Owner name is required.";
  }

  if (!owner.phone_number.trim()) {
    fieldErrors.phone_number = "Phone number is required.";
  }

  if (!owner.email.trim()) {
    fieldErrors.email = "Email address is required.";
  }

  return fieldErrors;
}

export function validateOwnerInfoFormValues(formValues: OwnerInfoFormValues) {
  const fieldErrorsByOwner: Record<number, OwnerFieldErrors> = {};

  for (let index = 0; index < formValues.owners.length; index += 1) {
    const owner = formValues.owners[index];
    const fieldErrors = validateOwnerFieldErrors(owner);

    if (Object.keys(fieldErrors).length > 0) {
      fieldErrorsByOwner[index] = fieldErrors;
    }
  }

  const hasErrors = Object.keys(fieldErrorsByOwner).length > 0;

  return {
    formErrors: hasErrors ? { owners: " " } : {},
    fieldErrorsByOwner,
    isValid: !hasErrors,
  };
}

function markAllOwnerFieldsTouched(
  owners: OwnerInfoItem[],
): Record<number, OwnerFieldTouched> {
  return owners.reduce<Record<number, OwnerFieldTouched>>(
    (accumulator, _, index) => {
      accumulator[index] = {
        owner_name: true,
        phone_number: true,
        email: true,
      };
      return accumulator;
    },
    {},
  );
}

export function useOwnerInfoForm(initialValues?: Partial<OwnerInfoFormValues>) {
  const [ownerFieldErrors, setOwnerFieldErrors] = useState<
    Record<number, OwnerFieldErrors>
  >({});
  const [ownerFieldTouched, setOwnerFieldTouched] = useState<
    Record<number, OwnerFieldTouched>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const form = useForm<OwnerInfoFormValues>({
    initialValues: {
      owners: [{ ...emptyOwnerInfoItem }],
      ...initialValues,
    },
    validate: (values) => validateOwnerInfoFormValues(values).formErrors,
  });

  const valuesRef = useRef(form.values);
  valuesRef.current = form.values;

  const applyValidation = useCallback((nextValues: OwnerInfoFormValues) => {
    const validation = validateOwnerInfoFormValues(nextValues);
    form.setErrors(validation.formErrors);
    setOwnerFieldErrors(validation.fieldErrorsByOwner);
    return validation;
  }, [form]);

  const getFieldError = useCallback(
    (ownerIndex: number, field: keyof OwnerInfoItem) => {
      const shouldShow =
        submitAttempted || Boolean(ownerFieldTouched[ownerIndex]?.[field]);

      if (!shouldShow) {
        return undefined;
      }

      return ownerFieldErrors[ownerIndex]?.[field];
    },
    [ownerFieldErrors, ownerFieldTouched, submitAttempted],
  );

  const markOwnerFieldTouched = useCallback(
    (ownerIndex: number, field: keyof OwnerInfoItem) => {
      setOwnerFieldTouched((previous) => ({
        ...previous,
        [ownerIndex]: {
          ...previous[ownerIndex],
          [field]: true,
        },
      }));

      const validation = validateOwnerInfoFormValues(valuesRef.current);
      form.setErrors(validation.formErrors);
      setOwnerFieldErrors(validation.fieldErrorsByOwner);
    },
    [form],
  );

  const updateOwner = (
    index: number,
    patch: Partial<OwnerInfoItem>,
    nextValues?: OwnerInfoFormValues,
  ) => {
    const resolvedValues = nextValues ?? {
      ...valuesRef.current,
      owners: valuesRef.current.owners.map((owner, ownerIndex) =>
        ownerIndex === index ? { ...owner, ...patch } : owner,
      ),
    };

    form.setValues(resolvedValues);
    applyValidation(resolvedValues);
  };

  const addOwner = () => {
    const nextValues = {
      ...valuesRef.current,
      owners: [...valuesRef.current.owners, { ...emptyOwnerInfoItem }],
    };

    form.setValues(nextValues);
    applyValidation(nextValues);
  };

  const removeOwner = (index: number) => {
    if (valuesRef.current.owners.length <= 1) {
      return;
    }

    const nextValues = {
      ...valuesRef.current,
      owners: valuesRef.current.owners.filter((_, ownerIndex) => ownerIndex !== index),
    };

    setOwnerFieldErrors((previous) => {
      const next: Record<number, OwnerFieldErrors> = {};

      nextValues.owners.forEach((_, ownerIndex) => {
        const sourceIndex = ownerIndex < index ? ownerIndex : ownerIndex + 1;
        if (previous[sourceIndex]) {
          next[ownerIndex] = previous[sourceIndex];
        }
      });

      return next;
    });

    setOwnerFieldTouched((previous) => {
      const next: Record<number, OwnerFieldTouched> = {};

      nextValues.owners.forEach((_, ownerIndex) => {
        const sourceIndex = ownerIndex < index ? ownerIndex : ownerIndex + 1;
        if (previous[sourceIndex]) {
          next[ownerIndex] = previous[sourceIndex];
        }
      });

      return next;
    });

    form.setValues(nextValues);
    applyValidation(nextValues);
  };

  const submit = (onValid?: (values: OwnerInfoFormValues) => void) => {
    setSubmitAttempted(true);
    setOwnerFieldTouched(markAllOwnerFieldsTouched(valuesRef.current.owners));
    form.setTouched({ owners: true });

    const validation = applyValidation(valuesRef.current);

    if (validation.isValid) {
      onValid?.(valuesRef.current);
      return true;
    }

    return false;
  };

  return {
    ...form,
    ownerFieldErrors,
    ownerFieldTouched,
    submitAttempted,
    getFieldError,
    markOwnerFieldTouched,
    updateOwner,
    addOwner,
    removeOwner,
    submit,
  };
}

export type UseOwnerInfoFormReturn = ReturnType<typeof useOwnerInfoForm>;
