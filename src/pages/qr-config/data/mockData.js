// Mock/initial data for the Super Admin QR Config module.
// Replace with real API calls when the backend endpoints are available.

export const initialAvailability = {
  defaultQr: { enabled: true, label: "Default QR" },
  premiumQr: { enabled: true, label: "Premium QR" },
  paidQr: { enabled: true, label: "Additional Paid QR" },
};

export const initialAllocation = {
  basic: 1,
  standard: 3,
  premium: 5,
};

export const initialRules = {
  defaultQrRule: true,
  premiumQrRule: true,
  paidQrRule: true,
};

export const initialPricing = {
  currency: "INR",
  additionalStandard: 50,
  additionalPremium: 100,
};

export const initialTemplates = [
  {
    id: "tpl_1",
    name: "Classic",
    type: "Default",
    status: "Active",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-05",
  },
  {
    id: "tpl_2",
    name: "Modern",
    type: "Premium",
    status: "Active",
    createdAt: "2026-08-02",
    updatedAt: "2026-08-06",
  },
  {
    id: "tpl_3",
    name: "Minimal",
    type: "Premium",
    status: "Inactive",
    createdAt: "2026-08-03",
    updatedAt: "2026-08-06",
  },
  {
    id: "tpl_4",
    name: "Elegant",
    type: "Premium",
    status: "Active",
    createdAt: "2026-08-04",
    updatedAt: "2026-08-07",
  },
  {
    id: "tpl_5",
    name: "Restaurant Premium",
    type: "Premium",
    status: "Active",
    createdAt: "2026-08-05",
    updatedAt: "2026-08-08",
  },
];

export const qrTypeMatrix = [
  {
    type: "Default QR",
    available: true,
    subscriptionControlled: "No",
    paid: false,
  },
  {
    type: "Premium QR",
    available: true,
    subscriptionControlled: "Yes",
    paid: false,
  },
  {
    type: "Additional QR",
    available: true,
    subscriptionControlled: "As Defined",
    paid: true,
  },
];
