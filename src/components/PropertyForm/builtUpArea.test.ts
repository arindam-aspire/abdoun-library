import { describe, expect, it } from "vitest";
import { validatePropertyDetailsFormValues } from "../../hooks/usePropertyDetailsFormHook";
import {
  emptyPropertyDetailsFormValues,
  mergePropertyFormValues,
} from "./propertyFormDefaults";
import type { PropertyDetailsFormValues } from "./types";

const validPropertyDetails: PropertyDetailsFormValues = {
  ...emptyPropertyDetailsFormValues,
  bedrooms: 2,
  bathrooms: 2,
  built_up_area: "125.5",
  built_up_area_unit: "SQFT",
  parking_spaces: 1,
  property_age: "1-5",
  completion_status: "ready",
  total_floor: "3",
  occupancy: "vacant",
  ownership_type: "freehold",
  reference_number: "REF-1",
  permit_dld_number: "DLD-1",
  orientation: "north",
};

describe("Built-up Area", () => {
  it.each(["1", "125.5", ".5", "001.25"])(
    "accepts the positive decimal value %s",
    (builtUpArea) => {
      const errors = validatePropertyDetailsFormValues({
        ...validPropertyDetails,
        built_up_area: builtUpArea,
      });

      expect(errors.built_up_area).toBeUndefined();
    },
  );

  it.each(["0", "0.0", "-1", "abc", "1e3", "1.2.3", "Infinity"])(
    "rejects the invalid value %s",
    (builtUpArea) => {
      const errors = validatePropertyDetailsFormValues({
        ...validPropertyDetails,
        built_up_area: builtUpArea,
      });

      expect(errors.built_up_area).toBe(
        "Enter a valid positive built-up area.",
      );
    },
  );

  it("keeps the required error for an empty value", () => {
    const errors = validatePropertyDetailsFormValues({
      ...validPropertyDetails,
      built_up_area: " ",
    });

    expect(errors.built_up_area).toBe("Built-up area is required.");
  });

  it("defaults legacy externally supplied values to SQM", () => {
    const {
      built_up_area_unit: _omittedUnit,
      ...legacyPropertyDetails
    } = validPropertyDetails;

    const merged = mergePropertyFormValues({
      property_details: legacyPropertyDetails,
    });

    expect(merged.property_details.built_up_area).toBe("125.5");
    expect(merged.property_details.built_up_area_unit).toBe("SQM");
  });

  it("preserves an externally supplied unit without converting the value", () => {
    const merged = mergePropertyFormValues({
      property_details: validPropertyDetails,
    });

    expect(merged.property_details.built_up_area).toBe("125.5");
    expect(merged.property_details.built_up_area_unit).toBe("SQFT");
  });
});
