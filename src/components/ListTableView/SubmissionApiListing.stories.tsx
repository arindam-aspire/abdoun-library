import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useMemo, useState } from "react";
import type { SortConfig } from "../ui/Table";
import { ListTableView } from "./index";
import {
  mapSubmissionApiListingsToPropertyListings,
  type SubmissionApiListing,
} from "./submissionApiListing";
import { submissionApiListTableJson } from "./submissionApiListTableStoryData";
import type { ListTableViewProps } from "./types";
import { demoWorkflowActions } from "./workflowActionsStoryConfig";

/**
 * Example payload from the MLS submissions list API.
 * Pass this array to `mapSubmissionApiListingsToPropertyListings()` before `ListTableView`.
 */
const exampleSubmissionApiJson: SubmissionApiListing[] = submissionApiListTableJson;

function SubmissionApiListTableDemo({
  apiData = exampleSubmissionApiJson,
  initialSort = [] as SortConfig,
  ...rest
}: Omit<ListTableViewProps, "data" | "sortConfig" | "onSort"> & {
  apiData?: SubmissionApiListing[];
  initialSort?: SortConfig;
}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const data = useMemo(
    () => mapSubmissionApiListingsToPropertyListings(apiData),
    [apiData],
  );

  return (
    <ListTableView
      data={data}
      sortConfig={sortConfig}
      onSort={setSortConfig}
      pagination={{
        total: data.length,
        page: 1,
        pageSize: 10,
        pageOptions: [5, 10, 25],
        onPageChange: fn(),
        onPageSizeChange: fn(),
      }}
      workflowActions={demoWorkflowActions}
      onClick={fn()}
      listTitle="Submissions"
      {...rest}
    />
  );
}

const meta = {
  title: "ListTableView/Submission API",
  component: SubmissionApiListTableDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Use `mapSubmissionApiListingsToPropertyListings()` to convert MLS submission API JSON into `PropertyListing[]` for `ListTableView`.",
          "",
          "**Status mapping**",
          "- Badge label: `status_name` (e.g. `Verified`)",
          "- Badge color + workflow actions: `submission_workflow_label` (e.g. `pending_admin_approval`)",
          "",
          "**Example API JSON**",
          "```json",
          JSON.stringify(exampleSubmissionApiJson, null, 2),
          "```",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-7xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onColumnWidthsChange: fn(),
  },
} satisfies Meta<typeof SubmissionApiListTableDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MobileTransposedView: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Same API payload below `sm`: pinned field labels, horizontal listing columns, and per-status workflow icon buttons.",
      },
    },
  },
};

export const WithPinnedColumns: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    pinnedColumns: {
      left: ["reference", "property"],
      right: ["action"],
    },
    onColumnWidthsChange: fn(),
  },
};
