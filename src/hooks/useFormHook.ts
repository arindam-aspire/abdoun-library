"use client";

import type React from "react";
import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Errors<T>;
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validate,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Touched<T>>({});

  const validateField = (name: keyof T, value: T[keyof T]) => {
    if (!validate) return "";

    const fieldErrors = validate({ ...values, [name]: value } as T);
    return fieldErrors[name] ?? "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as keyof T;

    setValues((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value as T[keyof T]),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as keyof T;

    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value as T[keyof T]),
    }));
  };

  const handleSubmit =
    (onSubmit: (values: T) => void) =>
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const allTouched = {} as Touched<T>;
      (Object.keys(values) as (keyof T)[]).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      const formErrors = validate ? validate(values) : {};
      setErrors(formErrors);

      if (Object.keys(formErrors).length === 0) {
        onSubmit(values);
      }
    };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setTouched,
  };
};
