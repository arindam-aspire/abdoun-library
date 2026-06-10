import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { FileSelectInput } from "./index";
import type { SelectedDocument } from "./types";
import { FILE_SELECT_SIZES } from "./types";

const sampleDocuments: SelectedDocument[] = [
  {
    name: "national-id.pdf",
    uri: "https://example.com/national-id.pdf",
    mimeType: "application/pdf",
    size: 102400,
  },
];

const meta = {
  title: "UI/FileSelectInput",
  component: FileSelectInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl px-4">
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
      options: FILE_SELECT_SIZES,
    },
  },
} satisfies Meta<typeof FileSelectInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Owner Document",
    value: [],
  },
};

export const WithDocuments: Story = {
  args: {
    label: "Owner Document",
    value: sampleDocuments,
  },
};

export const WithUploadHandler: Story = {
  args: {
    label: "Owner Document",
    value: [],
    onUpload: async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return `https://example.com/uploads/${encodeURIComponent(file.name)}`;
    },
  },
};

function InteractiveDemo() {
  const [documents, setDocuments] = useState<SelectedDocument[]>([]);

  return (
    <FileSelectInput
      label="Owner Document"
      value={documents}
      onChange={setDocuments}
      onUpload={async (file) =>
        `https://example.com/uploads/${encodeURIComponent(file.name)}`
      }
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
