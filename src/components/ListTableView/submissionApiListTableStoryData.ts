import type { SubmissionApiListing } from "./submissionApiListing";
import { mapSubmissionApiListingsToPropertyListings } from "./submissionApiListing";

/** Raw API payload as returned by the submissions list endpoint. */
export const submissionApiListTableJson: SubmissionApiListing[] = [
  {
    property_id: "81316c83-270f-471c-8274-482083fe5d67",
    property_hash: 503748348,
    title: "My First Property",
    listing_purpose: "sale",
    type_name: "Building",
    type_slug: "building",
    category_name: "Residential",
    category_slug: "residential",
    status_name: "Verified",
    status_slug: "verified",
    price: "12000.00",
    currency: "JOD",
    reference_number: "REF-0056",
    created_at: "2026-06-09T04:54:44.576032",
    updated_at: "2026-06-09T04:54:44.576032",
    submission_id: "d79f2cb1-66b5-454d-b6e7-e5b210fc098f",
    submission_status: "submitted",
    submission_submitted_at: "2026-06-09T04:54:44.660082Z",
    submission_reviewed_at: null,
    submission_review_reason: null,
    submission_workflow_label: "pending_admin_approval",
    can_edit_submission: false,
    can_delete_submission: false,
    agency: null,
  },
];

export const submissionApiListTableListings =
  mapSubmissionApiListingsToPropertyListings(submissionApiListTableJson);
