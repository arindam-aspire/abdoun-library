import type { Owner } from "./types";

export const ownerListStoryOwners: Owner[] = [
  {
    id: "owner-001",
    name: "Ahmad Al-Khatib",
    email: "ahmad.khatib@example.com",
    phone: "+962 79 111 2233",
    propertyOwned: 4,
    joinedAt: "2024-03-15T10:00:00.000Z",
    status: { key: "active", label: "Active" },
  },
  {
    id: "owner-002",
    name: "Lina Mansour",
    email: "lina.mansour@example.com",
    phone: "+962 78 222 3344",
    propertyOwned: 2,
    joinedAt: "2025-01-20T14:30:00.000Z",
    status: { key: "active", label: "Active" },
  },
  {
    id: "owner-003",
    name: "Hassan Odeh",
    email: "hassan.odeh@example.com",
    propertyOwned: 1,
    joinedAt: "2023-11-08T09:15:00.000Z",
    status: { key: "suspended", label: "Suspended" },
  },
  {
    id: "owner-004",
    name: "Maya Faris",
    email: "maya.faris@example.com",
    phone: "+962 79 555 6677",
    propertyOwned: 6,
    joinedAt: "2022-07-01T08:00:00.000Z",
    status: { key: "active", label: "Active" },
  },
  {
    id: "owner-005",
    name: "Yousef Nasser",
    propertyOwned: 0,
    joinedAt: "2026-02-10T16:45:00.000Z",
    status: { key: "active", label: "Active" },
  },
];
