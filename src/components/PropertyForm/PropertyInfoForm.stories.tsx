import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { usePropertyDetailsForm } from "../../hooks/usePropertyDetailsFormHook";
import { emptyPropertyDetailsFormValues } from "./propertyFormDefaults";
import { PropertyInfoForm } from "./PropertyInfoForm";

const meta = {
  title: "Components/PropertyForm/PropertyInfoForm",
  component: PropertyInfoForm,
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
} satisfies Meta<typeof PropertyInfoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function PropertyInfoFormDemo(
  props: Partial<typeof emptyPropertyDetailsFormValues> = {},
) {
  const form = usePropertyDetailsForm(props);

  return <PropertyInfoForm form={form} />;
}

export const Default: Story = {
  render: () => <PropertyInfoFormDemo />,
};

export const DecimalWithSqFtUnit: Story = {
  render: () => (
    <PropertyInfoFormDemo
      built_up_area="125.5"
      built_up_area_unit="SQFT"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const builtUpAreaInput = canvas.getByLabelText("Built-up Area");
    const unitSelect = canvas.getByLabelText("Unit");

    expect(builtUpAreaInput).toHaveValue(125.5);
    expect(unitSelect).toHaveTextContent("sq. ft.");

    await userEvent.click(unitSelect);
    await userEvent.click(
      within(document.body).getByRole("option", { name: "sq. m." }),
    );

    expect(builtUpAreaInput).toHaveValue(125.5);
    expect(unitSelect).toHaveTextContent("sq. m.");
  },
};

export const LegacyWithoutUnit: Story = {
  render: function LegacyWithoutUnitDemo() {
    const form = usePropertyDetailsForm({ built_up_area: "3200" });

    return <PropertyInfoForm form={form} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "When only `built_up_area` is supplied, the form defaults the unit to `SQM`.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText("Unit")).toHaveTextContent("sq. m.");
  },
};
