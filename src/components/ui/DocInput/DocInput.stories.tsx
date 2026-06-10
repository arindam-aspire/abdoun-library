import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { DocInput } from "./index";
import { DOC_INPUT_SIZES } from "./types";
import type { DocInputDocument } from "./types";

const sampleDocuments: DocInputDocument[] = [
  {
    name: "Annual_Report_2023.pdf",
    uri: "https://example.com/annual-report-2023.pdf",
    mimeType: "application/pdf",
    size: 4404019,
  },
  {
    name: "ownership-deed.docx",
    uri: "https://example.com/ownership-deed.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 248320,
  },
];

const meta = {
  title: "UI/DocInput",
  component: DocInput,
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
      options: DOC_INPUT_SIZES,
    },
  },
} satisfies Meta<typeof DocInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Owner Document",
    value: [],
    hint: "Select multiple documents at once using Ctrl/Cmd+click or Shift+click.",
  },
};

export const WithDocuments: Story = {
  args: {
    label: "Owner Document",
    value: sampleDocuments.slice(0, 1),
  },
};

export const MultipleDocuments: Story = {
  args: {
    label: "Property Documents",
    value: sampleDocuments,
  },
};

export const WithUploadHandler: Story = {
  args: {
    label: "Owner Document",
    value: [],
    onUpload: async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return `https://example.com/uploads/${encodeURIComponent(file.name)}`;
    },
  },
};

export const WithError: Story = {
  args: {
    label: "Owner Document",
    value: [],
    error: "Please upload at least one owner document.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Owner Document",
    value: sampleDocuments,
    disabled: true,
  },
};

function InteractiveDemo() {
  const [documents, setDocuments] = useState<DocInputDocument[]>([]);

  return (
    <DocInput
      label="Owner Document"
      value={documents}
      onChange={setDocuments}
      onUpload={async (file) => {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        return `https://example.com/uploads/${encodeURIComponent(file.name)}`;
      }}
      hint="Try drag-and-drop or Select Files to attach multiple documents."
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
