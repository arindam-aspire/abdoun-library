import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { FileSelectInput } from "../FileSelectInput";
import type { SelectedDocument } from "../FileSelectInput";
import { MediaInput } from "./index";
import { MEDIA_INPUT_SIZES } from "./types";
import type { SelectedMedia } from "./types";

const sampleMedia: SelectedMedia[] = [
  {
    name: "living-room.jpg",
    uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    mimeType: "image/jpeg",
    size: 245760,
  },
  {
    name: "property-tour.mp4",
    uri: "https://example.com/property-tour.mp4",
    mimeType: "video/mp4",
    size: 5242880,
  },
];

const meta = {
  title: "UI/MediaInput",
  component: MediaInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full min-w-0 max-w-3xl px-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: MEDIA_INPUT_SIZES,
    },
  },
} satisfies Meta<typeof MediaInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Property Media",
    value: [],
  },
};

export const WithMedia: Story = {
  args: {
    label: "Property Media",
    value: sampleMedia,
  },
};

export const WithUploadHandler: Story = {
  args: {
    label: "Property Media",
    value: [],
    hint: "You can select multiple photos or videos in one go.",
    onUpload: async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return `https://example.com/uploads/${encodeURIComponent(file.name)}`;
    },
  },
};

export const WithError: Story = {
  args: {
    label: "Property Media",
    value: [],
    error: "Please upload at least one image.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Property Media",
    value: sampleMedia,
    disabled: true,
  },
};

function InteractiveDemo() {
  const [media, setMedia] = useState<SelectedMedia[]>([]);

  return (
    <MediaInput
      label="Property Media"
      value={media}
      onChange={setMedia}
      onUpload={async (file) => {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        return URL.createObjectURL(file);
      }}
      hint={`${media.length} file(s) selected.`}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

const samplePropertyDocument: SelectedDocument = {
  name: "title-deed.pdf",
  uri: "https://example.com/title-deed.pdf",
  mimeType: "application/pdf",
  size: 156000,
};

function MediaAndDocumentsDemo() {
  const [media, setMedia] = useState<SelectedMedia[]>(sampleMedia);
  const [documents, setDocuments] = useState<SelectedDocument[]>([
    samplePropertyDocument,
  ]);

  return (
    <div className="flex w-full flex-col gap-8">
      <MediaInput
        label="Property Photos & Videos"
        value={media}
        onChange={setMedia}
        hint="Upload at least one photo of the property."
      />
      <FileSelectInput
        label="Property Documents"
        value={documents}
        onChange={setDocuments}
        hint="Title deed, floor plans, or other supporting documents."
      />
    </div>
  );
}

export const WithDocumentsTogether: Story = {
  render: () => <MediaAndDocumentsDemo />,
};
