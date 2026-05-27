import { PropertyListCardSkleton } from "./PropertyListCardSkleton";

const meta = {
  title: "Components/PropertyCard/PropertyListCardSkleton",
  component: PropertyListCardSkleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default = {};

export const InList = {
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <PropertyListCardSkleton />
      <PropertyListCardSkleton />
      <PropertyListCardSkleton />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
