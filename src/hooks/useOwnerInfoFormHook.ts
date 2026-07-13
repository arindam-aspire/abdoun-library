"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isOwnerInfoFieldReadOnly } from "../components/PropertyForm/ownerInfoConfig";
import type {
  OwnerInfoConfig,
  OwnerInfoFormValues,
  OwnerInfoItem,
  OwnerInfoReadOnlyField,
  OwnerInfoValidationMessages,
} from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { OwnerInfoFormValues, OwnerInfoItem };

export type OwnerFieldErrors = Partial<Record<keyof OwnerInfoItem, string>>;
export type OwnerFieldTouched = Partial<Record<keyof OwnerInfoItem, boolean>>;

export type OwnerInfoValidationOptions = Pick<
  OwnerInfoConfig,
  "requireDocuments" | "validationMessages"
>;

export const DEFAULT_OWNER_COUNTRY_CODE = "+962";

export const OWNER_INFO_REQUIRED_FIELDS = [
  "owner_name",
  "phone_number",
  "email",
] as const satisfies readonly (keyof OwnerInfoItem)[];

const DEFAULT_VALIDATION_MESSAGES: Required<OwnerInfoValidationMessages> = {
  ownerNameRequired: "Owner name is required.",
  phoneRequired: "Phone number is required.",
  emailRequired: "Email address is required.",
  ownerDocumentRequired: "At least one owner document is required.",
};

const OWNER_INFO_READ_ONLY_PATCH_FIELDS: OwnerInfoReadOnlyField[] = [
  "owner_name",
  "country_code",
  "phone_number",
  "email",
];

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

export function resolveOwnerInfoValidationMessages(
  messages?: OwnerInfoValidationMessages,
): Required<OwnerInfoValidationMessages> {
  return {
    ...DEFAULT_VALIDATION_MESSAGES,
    ...messages,
  };
}

export function hasUploadedOwnerDocument(owner: OwnerInfoItem): boolean {
  return owner.owner_documents.some((document) => Boolean(document.uri?.trim()));
}

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
  options?: OwnerInfoValidationOptions,
): OwnerFieldErrors {
  const messages = resolveOwnerInfoValidationMessages(options?.validationMessages);
  const fieldErrors: OwnerFieldErrors = {};

  if (!owner.owner_name.trim()) {
    fieldErrors.owner_name = messages.ownerNameRequired;
  }

  if (!owner.phone_number.trim()) {
    fieldErrors.phone_number = messages.phoneRequired;
  }

  if (!owner.email.trim()) {
    fieldErrors.email = messages.emailRequired;
  }

  if (options?.requireDocuments && !hasUploadedOwnerDocument(owner)) {
    fieldErrors.owner_documents = messages.ownerDocumentRequired;
  }

  return fieldErrors;
}

export function validateOwnerInfoFormValues(
  formValues: OwnerInfoFormValues,
  options?: OwnerInfoValidationOptions,
) {
  const fieldErrorsByOwner: Record<number, OwnerFieldErrors> = {};

  for (let index = 0; index < formValues.owners.length; index += 1) {
    const owner = formValues.owners[index];

    if (!hasOwnerInfoContent(owner) && formValues.owners.length > 1) {
      continue;
    }

    const fieldErrors = validateOwnerFieldErrors(owner, options);

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
  options?: Pick<OwnerInfoValidationOptions, "requireDocuments">,
): Record<number, OwnerFieldTouched> {
  return owners.reduce<Record<number, OwnerFieldTouched>>(
    (accumulator, _, index) => {
      accumulator[index] = {
        owner_name: true,
        phone_number: true,
        email: true,
        ...(options?.requireDocuments ? { owner_documents: true } : {}),
      };
      return accumulator;
    },
    {},
  );
}

function filterReadOnlyOwnerPatch(
  ownerIndex: number,
  patch: Partial<OwnerInfoItem>,
  config?: OwnerInfoConfig,
): Partial<OwnerInfoItem> {
  return Object.fromEntries(
    Object.entries(patch).filter(([field]) => {
      if (
        !(OWNER_INFO_READ_ONLY_PATCH_FIELDS as readonly string[]).includes(
          field,
        )
      ) {
        return true;
      }

      return !isOwnerInfoFieldReadOnly(
        ownerIndex,
        field as OwnerInfoReadOnlyField,
        config,
      );
    }),
  ) as Partial<OwnerInfoItem>;
}

export function useOwnerInfoForm(
  initialValues?: Partial<OwnerInfoFormValues>,
  config?: OwnerInfoConfig,
) {
  const validationOptions = useMemo<OwnerInfoValidationOptions>(
    () => ({
      requireDocuments: config?.requireDocuments,
      validationMessages: config?.validationMessages,
    }),
    [config?.requireDocuments, config?.validationMessages],
  );

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
    validate: (values) =>
      validateOwnerInfoFormValues(values, validationOptions).formErrors,
  });
  const { setValues, setErrors, setTouched } = form;

  const valuesRef = useRef(form.values);
  valuesRef.current = form.values;
  const configRef = useRef(config);
  configRef.current = config;

  const applyValidation = useCallback(
    (nextValues: OwnerInfoFormValues) => {
      const validation = validateOwnerInfoFormValues(
        nextValues,
        validationOptions,
      );
      setErrors(validation.formErrors);
      setOwnerFieldErrors(validation.fieldErrorsByOwner);
      return validation;
    },
    [setErrors, validationOptions],
  );

  useEffect(() => {
    applyValidation(valuesRef.current);
  }, [applyValidation]);

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
    (
      ownerIndex: number,
      field: keyof OwnerInfoItem,
      valuesOverride?: OwnerInfoFormValues,
    ) => {
      setOwnerFieldTouched((previous) => ({
        ...previous,
        [ownerIndex]: {
          ...previous[ownerIndex],
          [field]: true,
        },
      }));

      const validation = validateOwnerInfoFormValues(
        valuesOverride ?? valuesRef.current,
        validationOptions,
      );
      setErrors(validation.formErrors);
      setOwnerFieldErrors(validation.fieldErrorsByOwner);
    },
    [setErrors, validationOptions],
  );

  const updateOwner = (
    index: number,
    patch: Partial<OwnerInfoItem>,
    nextValues?: OwnerInfoFormValues,
  ) => {
    const filteredPatch = filterReadOnlyOwnerPatch(
      index,
      patch,
      configRef.current,
    );

    if (Object.keys(filteredPatch).length === 0) {
      return;
    }

    const resolvedValues = nextValues ?? {
      ...valuesRef.current,
      owners: valuesRef.current.owners.map((owner, ownerIndex) =>
        ownerIndex === index ? { ...owner, ...filteredPatch } : owner,
      ),
    };

    setValues(resolvedValues);
    applyValidation(resolvedValues);

    if ("owner_documents" in filteredPatch) {
      setOwnerFieldTouched((previous) => ({
        ...previous,
        [index]: {
          ...previous[index],
          owner_documents: true,
        },
      }));
    }
  };

  const addOwner = () => {
    const nextValues = {
      ...valuesRef.current,
      owners: [...valuesRef.current.owners, { ...emptyOwnerInfoItem }],
    };

    setValues(nextValues);
    applyValidation(nextValues);
  };

  const removeOwner = (index: number) => {
    const readOnlyIndices = configRef.current?.readOnlyOwnerIndices ?? [];

    if (readOnlyIndices.includes(index)) {
      return;
    }

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

    setValues(nextValues);
    applyValidation(nextValues);
  };

  const submit = (onValid?: (values: OwnerInfoFormValues) => void) => {
    setSubmitAttempted(true);
    setOwnerFieldTouched(
      markAllOwnerFieldsTouched(valuesRef.current.owners, validationOptions),
    );
    setTouched({ owners: true });

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
