import type { Meta, StoryObj } from "@storybook/react-vite";
import { usePricingDetailsForm } from "../../hooks/usePricingDetailsFormHook";
import { PricingInfoForm } from "./PricingInfoForm";

const meta = {
  title: "Components/PropertyForm/PricingInfoForm",
  component: PricingInfoForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingInfoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function PricingInfoFormDemo() {
  const form = usePricingDetailsForm();

  return <PricingInfoForm form={form} />;
}

export const Default: Story = {
  render: () => <PricingInfoFormDemo />,
};

function PricingInfoFormPrefilledDemo() {
  const form = usePricingDetailsForm({
    price: "250000",
    service_charge: "1200",
    maintenance_fee: "500",
  });

  return <PricingInfoForm form={form} />;
}

export const Prefilled: Story = {
  render: () => <PricingInfoFormPrefilledDemo />,
};
