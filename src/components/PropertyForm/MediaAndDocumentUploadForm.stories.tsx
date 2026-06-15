import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useMediaUploadForm } from "../../hooks/useMediaUploadFormHook";
import { MediaAndDocumentUploadForm } from "./MediaAndDocumentUploadForm";

const meta = {
  title: "Components/PropertyForm/MediaAndDocumentUploadForm",
  component: MediaAndDocumentUploadForm,
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
} satisfies Meta<typeof MediaAndDocumentUploadForm>;

export default meta;

type Story = StoryObj<typeof meta>;

const uploadHandler = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return URL.createObjectURL(file);
};

function MediaFormDemo() {
  const form = useMediaUploadForm();

  return (
    <MediaAndDocumentUploadForm
      form={form}
      onUploadPropertyMedia={uploadHandler}
      onUploadPropertyDocument={uploadHandler}
      onPropertyMediaChange={fn()}
      onRemovePropertyMedia={fn()}
      onPropertyDocumentsChange={fn()}
      onRemovePropertyDocument={fn()}
    />
  );
}

export const Default: Story = {
  render: () => <MediaFormDemo />,
};

export const WithUploadHandlers: Story = {
  render: () => <MediaFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Valid files are passed to `onUploadPropertyMedia` / `onUploadPropertyDocument` on drop or browse. Each input shows its own upload queue and progress; committed items are returned via `onPropertyMediaChange` / `onPropertyDocumentsChange`, with `onRemovePropertyMedia` / `onRemovePropertyDocument` on removal.",
      },
    },
  },
};
