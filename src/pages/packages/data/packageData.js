import { packageFeatureGroups } from "./featureData";

export const initialPackages = [
  {
    id: "PKG-001",
    name: "Basic",
    description: "Essential features for small restaurants",
    duration: "30_days",
    durationDisplay: "30 Days",
    features: ["qr", "website"],
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "PKG-002",
    name: "Standard",
    description: "Complete solution for growing restaurants",
    duration: "3_months",
    durationDisplay: "3 Months",
    features: ["qr", "premium_qr", "website", "inquiry", "offers", "google_review"],
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-02-20",
  },
  {
    id: "PKG-003",
    name: "Premium",
    description: "Advanced features for established restaurants",
    duration: "1_year",
    durationDisplay: "1 Year",
    features: ["qr", "premium_qr", "additional_qr", "website", "inquiry", "offers", "google_review"],
    status: "active",
    createdAt: "2024-01-05",
    updatedAt: "2024-03-01",
  },
  {
    id: "PKG-004",
    name: "Starter",
    description: "Basic package for new restaurants",
    duration: "30_days",
    durationDisplay: "30 Days",
    features: ["qr"],
    status: "inactive",
    createdAt: "2023-12-01",
    updatedAt: "2023-12-01",
  },
];

export const durationOptions = [
  { value: "30_days", label: "30 Days", days: 30 },
  { value: "3_months", label: "3 Months", days: 90 },
  { value: "6_months", label: "6 Months", days: 180 },
  { value: "1_year", label: "1 Year", days: 365 },
];

export { packageFeatureGroups };