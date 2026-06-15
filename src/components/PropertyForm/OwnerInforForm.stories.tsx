import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useOwnerInfoForm } from "../../hooks/useOwnerInfoFormHook";
import { OwnerInforForm } from "./OwnerInforForm";

const meta = {
  title: "Components/PropertyForm/OwnerInforForm",
  component: OwnerInforForm,
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
} satisfies Meta<typeof OwnerInforForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function OwnerFormDemo() {
  const form = useOwnerInfoForm();

  return (
    <OwnerInforForm
      form={form}
      onUploadOwnerDocument={async (file, { ownerIndex }) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return `https://example.com/owners/${ownerIndex}/${encodeURIComponent(file.name)}`;
      }}
      onOwnerDocumentsChange={fn()}
      onRemoveOwnerDocument={fn()}
    />
  );
}

export const Default: Story = {
  render: () => <OwnerFormDemo />,
};

export const WithUploadHandler: Story = {
  render: () => <OwnerFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Valid files are passed to `onUploadOwnerDocument` on drop or browse. `FileSelectInput` shows the upload queue and progress; committed documents are returned via `onOwnerDocumentsChange`.",
      },
    },
  },
};
