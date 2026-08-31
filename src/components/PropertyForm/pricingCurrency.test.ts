import { describe, expect, it } from "vitest";
import {
  emptyPricingDetailsFormValues,
  mergePropertyFormValues,
} from "./propertyFormDefaults";

describe("Pricing currencies", () => {
  it("defaults legacy externally supplied pricing values to JOD", () => {
    const merged = mergePropertyFormValues({
      pricing_details: {
        price: "1000",
        service_charge: "50",
        maintenance_fee: "25",
      },
    });

    expect(merged.pricing_details.price_currency).toBe("JOD");
    expect(merged.pricing_details.service_charge_currency).toBe("JOD");
    expect(merged.pricing_details.maintenance_fee_currency).toBe("JOD");
  });

  it("preserves externally supplied currencies", () => {
    const merged = mergePropertyFormValues({
      pricing_details: {
        ...emptyPricingDetailsFormValues,
        price: "850000",
        price_currency: "JOD",
        service_charge: "1200",
        service_charge_currency: "USD",
        maintenance_fee: "450",
        maintenance_fee_currency: "GBP",
      },
    });

    expect(merged.pricing_details.price_currency).toBe("JOD");
    expect(merged.pricing_details.service_charge_currency).toBe("USD");
    expect(merged.pricing_details.maintenance_fee_currency).toBe("GBP");
  });

  it("normalizes invalid currency values to JOD", () => {
    const merged = mergePropertyFormValues({
      pricing_details: {
        ...emptyPricingDetailsFormValues,
        price_currency: "EUR" as "JOD",
      },
    });

    expect(merged.pricing_details.price_currency).toBe("JOD");
  });
});
