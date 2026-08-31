import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { usePricingDetailsForm } from "../../hooks/usePricingDetailsFormHook";
import { PricingInfoForm } from "./PricingInfoForm";

const meta = {
  title: "Components/PropertyForm/PricingInfoForm",
  component: PricingInfoForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingInfoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function PricingFormDemo() {
  const form = usePricingDetailsForm({
    price: "850000",
    price_currency: "JOD",
    service_charge: "1200",
    service_charge_currency: "USD",
    maintenance_fee: "450",
    maintenance_fee_currency: "GBP",
  });

  return <PricingInfoForm form={form} />;
}

export const Default: Story = {
  render: () => <PricingFormDemo />,
};

export const PriceCurrencySyncsFees: Story = {
  render: function PriceCurrencySyncDemo() {
    const form = usePricingDetailsForm();
    return <PricingInfoForm form={form} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const currencySelects = canvas.getAllByLabelText("Currency");

    expect(currencySelects[0]).toHaveTextContent("JOD");
    expect(currencySelects[1]).toHaveTextContent("JOD");
    expect(currencySelects[2]).toHaveTextContent("JOD");

    await userEvent.click(currencySelects[0]!);
    await userEvent.click(within(document.body).getByRole("option", { name: "USD" }));

    const updatedCurrencySelects = canvas.getAllByLabelText("Currency");
    expect(updatedCurrencySelects[0]).toHaveTextContent("USD");
    expect(updatedCurrencySelects[1]).toHaveTextContent("USD");
    expect(updatedCurrencySelects[2]).toHaveTextContent("USD");
  },
};
