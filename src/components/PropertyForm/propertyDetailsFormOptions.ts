function numericOptions(max: number) {
  return Array.from({ length: max }, (_, index) => {
    const value = String(index + 1);

    return { value, label: value };
  });
}

export const bedroomOptions = numericOptions(10);

export const bathroomOptions = numericOptions(10);

export const parkingSpaceOptions = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export const propertyAgeOptions = [
  { value: "new", label: "New" },
  { value: "1-5", label: "1-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "10+", label: "10+ years" },
];

export const completionStatusOptions = [
  { value: "ready", label: "Ready" },
  { value: "off-plan", label: "Off-plan" },
  { value: "under-construction", label: "Under construction" },
];

export const occupancyOptions = [
  { value: "vacant", label: "Vacant" },
  { value: "owner-occupied", label: "Owner occupied" },
  { value: "tenant-occupied", label: "Tenant occupied" },
];

export const ownershipTypeOptions = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
];

export const orientationOptions = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
];
