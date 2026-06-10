"use client";

import { useCallback, useRef } from "react";
import type { MediaUploadFormValues } from "../components/PropertyForm/types";
import type { SelectedDocument } from "../components/ui/FileSelectInput";
import { useForm } from "./useFormHook";

export type { MediaUploadFormValues };

export function validateMediaUploadFormValues(
  formValues: MediaUploadFormValues,
) {
  void formValues;
  return {};
}

export function useMediaUploadForm(
  initialValues?: Partial<MediaUploadFormValues>,
) {
  const form = useForm<MediaUploadFormValues>({
    initialValues: {
      media_files: [],
      youtube_url: "",
      virtual_tour_url: "",
      documents: [],
      ...initialValues,
    },
    validate: validateMediaUploadFormValues,
  });

  const valuesRef = useRef(form.values);
  valuesRef.current = form.values;

  const setMediaFiles = useCallback((mediaFiles: SelectedDocument[]) => {
    form.setValues({
      ...valuesRef.current,
      media_files: mediaFiles,
    });
  }, [form]);

  const setDocuments = useCallback((documents: SelectedDocument[]) => {
    form.setValues({
      ...valuesRef.current,
      documents,
    });
  }, [form]);

  const submit = (onValid?: (values: MediaUploadFormValues) => void) => {
    form.setTouched({
      media_files: true,
      youtube_url: true,
      virtual_tour_url: true,
      documents: true,
    });

    const formErrors = validateMediaUploadFormValues(valuesRef.current);
    form.setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      onValid?.(valuesRef.current);
      return true;
    }

    return false;
  };

  return {
    ...form,
    setMediaFiles,
    setDocuments,
    submit,
  };
}

export type UseMediaUploadFormReturn = ReturnType<typeof useMediaUploadForm>;
