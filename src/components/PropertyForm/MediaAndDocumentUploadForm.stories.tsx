import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMediaUploadForm } from "../../hooks/useMediaUploadFormHook";
import { MediaAndDocumentUploadForm } from "./MediaAndDocumentUploadForm";

const uploadHandler = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return URL.createObjectURL(file);
};

const meta = {
  title: "Components/PropertyForm/MediaAndDocumentUploadForm",
  component: MediaAndDocumentUploadForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full min-w-0 max-w-3xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    onUploadPropertyMedia: uploadHandler,
    onUploadPropertyDocument: uploadHandler,
  },
} satisfies Meta<typeof MediaAndDocumentUploadForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function MediaAndDocumentUploadFormDemo() {
  const form = useMediaUploadForm();

  return (
    <MediaAndDocumentUploadForm
      form={form}
      onUploadPropertyMedia={uploadHandler}
      onUploadPropertyDocument={uploadHandler}
    />
  );
}

export const Default: Story = {
  render: () => <MediaAndDocumentUploadFormDemo />,
};

function MediaAndDocumentUploadFormPrefilledDemo() {
  const form = useMediaUploadForm({
    media_files: [
      {
        name: "living-room.jpg",
        uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        mimeType: "image/jpeg",
        size: 204800,
      },
    ],
    youtube_url: "https://youtube.com/watch?v=example",
    virtual_tour_url: "https://tour.example.com/property",
    documents: [
      {
        name: "floor-plan.pdf",
        uri: "https://example.com/floor-plan.pdf",
        mimeType: "application/pdf",
        size: 156000,
      },
    ],
  });

  return (
    <MediaAndDocumentUploadForm
      form={form}
      onUploadPropertyMedia={uploadHandler}
      onUploadPropertyDocument={uploadHandler}
    />
  );
}

export const Prefilled: Story = {
  render: () => <MediaAndDocumentUploadFormPrefilledDemo />,
};
