/** Shared React hooks for abdoun-library. */

export { useForm } from "./useFormHook";
export type { UseFormOptions } from "./useFormHook";
export {
  useBasicInfoForm,
  validateBasicInfoFormValues,
} from "./useBasicInfoFormHook";
export type {
  BasicInfoFormValues,
  UseBasicInfoFormReturn,
} from "./useBasicInfoFormHook";
export {
  useLocationInsertForm,
  validateLocationInsertFormValues,
} from "./useLocationFormHook";
export type {
  LocationInsertFormValues,
  UseLocationInsertFormReturn,
} from "./useLocationFormHook";
export {
  usePropertyDetailsForm,
  validatePropertyDetailsFormValues,
} from "./usePropertyDetailsFormHook";
export type {
  PropertyDetailsFormValues,
  UsePropertyDetailsFormReturn,
} from "./usePropertyDetailsFormHook";
export type { BuiltUpAreaUnit } from "../components/PropertyForm/types";
export {
  DEFAULT_OWNER_COUNTRY_CODE,
  emptyOwnerInfoItem,
  filterOwnersWithContent,
  hasOwnerInfoContent,
  useOwnerInfoForm,
  validateOwnerInfoFormValues,
} from "./useOwnerInfoFormHook";
export type {
  OwnerInfoFormValues,
  OwnerInfoItem,
  UseOwnerInfoFormReturn,
} from "./useOwnerInfoFormHook";
export {
  usePricingDetailsForm,
  validatePricingDetailsFormValues,
} from "./usePricingDetailsFormHook";
export type {
  PricingDetailsFormValues,
  UsePricingDetailsFormReturn,
} from "./usePricingDetailsFormHook";
export type { PricingCurrency } from "../components/PropertyForm/types";
export {
  useAmenitiesForm,
  validateAmenitiesFormValues,
} from "./useAmenitiesFormHook";
export type {
  AmenitiesFormValues,
  UseAmenitiesFormReturn,
} from "./useAmenitiesFormHook";
