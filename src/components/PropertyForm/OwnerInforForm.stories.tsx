import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useOwnerInfoForm } from "../../hooks/useOwnerInfoFormHook";
import { OwnerInforForm } from "./OwnerInforForm";

const meta = {
  title: "Components/PropertyForm/OwnerInforForm",
  component: OwnerInforForm,
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
  args: {
    onUploadOwnerDocument: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return `https://example.com/uploads/${encodeURIComponent(file.name)}`;
    },
  },
} satisfies Meta<typeof OwnerInforForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function OwnerInforFormDemo() {
  const form = useOwnerInfoForm();

  return <OwnerInforForm form={form} onUploadOwnerDocument={meta.args.onUploadOwnerDocument} />;
}

export const Default: Story = {
  render: () => <OwnerInforFormDemo />,
};

function OwnerInforFormPrefilledDemo() {
  const form = useOwnerInfoForm({
    owners: [
      {
        owner_name: "Ahmad Ali",
        country_code: "+962",
        phone_number: "791234567",
        email: "ahmad@example.com",
        social_security_id: "",
        nationality: "jordanian",
        owner_address: "Amman, Jordan",
        owner_documents: [
          {
            name: "id.pdf",
            uri: "https://example.com/id.pdf",
            mimeType: "application/pdf",
            size: 102400,
          },
        ],
      },
      {
        owner_name: "Sara Hassan",
        country_code: "+966",
        phone_number: "501234567",
        email: "",
        social_security_id: "",
        nationality: "saudi",
        owner_address: "",
        owner_documents: [],
      },
    ],
  });

  return <OwnerInforForm form={form} onUploadOwnerDocument={meta.args.onUploadOwnerDocument} />;
}

export const Prefilled: Story = {
  render: () => <OwnerInforFormPrefilledDemo />,
};

function OwnerInforFormValidationDemo() {
  const form = useOwnerInfoForm();

  return (
    <div className="flex flex-col gap-4">
      <OwnerInforForm form={form} onUploadOwnerDocument={meta.args.onUploadOwnerDocument} />
      <button
        type="button"
        className="self-start rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text transition-colors hover:bg-page"
        onClick={() => {
          form.submit();
        }}
      >
        Validate owners
      </button>
    </div>
  );
}

export const Validation: Story = {
  render: () => <OwnerInforFormValidationDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Click Validate owners to show required-field errors inline on each input.",
      },
    },
  },
};
