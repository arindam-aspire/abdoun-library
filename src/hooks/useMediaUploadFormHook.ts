"use client";

import { useCallback, useRef } from "react";
import {
  normalizePropertyMediaFiles,
  setPrimaryPropertyMedia,
} from "../components/PropertyForm/propertyFormMedia";
import type {
  MediaUploadFormValues,
  PropertyMediaFile,
} from "../components/PropertyForm/types";
import type { SelectedDocument } from "../components/ui/FileSelectInput";
import {
  isImageMedia,
  isVideoMedia,
} from "../components/ui/MediaInput/utils";
import { useForm } from "./useFormHook";

export type { MediaUploadFormValues };

const MEDIA_FILES_REQUIRED_MESSAGE =
  "Please upload at least one property image or video.";

export function validateMediaUploadFormValues(
  formValues: MediaUploadFormValues,
) {
  const imageCount = formValues.media_files.filter((media) =>
    isImageMedia(media),
  ).length;
  const videoCount = formValues.media_files.filter((media) =>
    isVideoMedia(media),
  ).length;

  if (imageCount === 0 && videoCount === 0) {
    return { media_files: MEDIA_FILES_REQUIRED_MESSAGE };
  }

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

  const setMediaFiles = useCallback((mediaFiles: PropertyMediaFile[]) => {
    form.setValues({
      ...valuesRef.current,
      media_files: normalizePropertyMediaFiles(mediaFiles),
    });
  }, [form]);

  const setPrimaryMedia = useCallback((media: PropertyMediaFile) => {
    form.setValues({
      ...valuesRef.current,
      media_files: setPrimaryPropertyMedia(valuesRef.current.media_files, media),
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
    setPrimaryMedia,
    setDocuments,
    submit,
  };
}

export type UseMediaUploadFormReturn = ReturnType<typeof useMediaUploadForm>;
