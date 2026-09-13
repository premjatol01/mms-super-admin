// Mock data for the Super Admin Offers module.
// Replace `fetchOffersData` with a real API call when the backend is wired up —
// the shape below is what the rest of the module expects back.

export const OFFER_TYPES = {
  repeat_order_offer: 'Repeat Order',
  order_value_offer: 'Order Value',
  low_traffic_offer: 'Low-Traffic / Promotional',
};

export const STATUS = {
  ENABLED: 'Enabled',
  DISABLED: 'Disabled',
};

const initialFeatures = [
  {
    id: 'feat_repeat_order',
    key: 'repeat_order_offer',
    name: 'Repeat Order Offer',
    type: 'repeat_order_offer',
    description:
      'Allows Restaurant Admins to configure offers for customers who place another order within a defined period.',
    status: STATUS.ENABLED,
    displayOrder: 1,
    updatedAt: '2026-08-14T10:20:00Z',
    packages: [
      { id: 'pkg_starter', name: 'Starter' },
      { id: 'pkg_business', name: 'Business' },
      { id: 'pkg_premium', name: 'Premium' },
    ],
  },
  {
    id: 'feat_order_value',
    key: 'order_value_offer',
    name: 'Order Value-Based Offer',
    type: 'order_value_offer',
    description: 'Allows Restaurant Admins to create offers based on order value.',
    status: STATUS.ENABLED,
    displayOrder: 2,
    updatedAt: '2026-09-02T15:45:00Z',
    packages: [
      { id: 'pkg_business', name: 'Business' },
      { id: 'pkg_premium', name: 'Premium' },
    ],
  },
  {
    id: 'feat_low_traffic',
    key: 'low_traffic_offer',
    name: 'Low-Traffic / Promotional Offer',
    type: 'low_traffic_offer',
    description:
      'Allows Restaurant Admins to configure promotional offers based on order value or selected menu items and specific days/dates.',
    status: STATUS.DISABLED,
    displayOrder: 3,
    updatedAt: '2026-07-30T09:05:00Z',
    packages: [{ id: 'pkg_premium', name: 'Premium' }],
  },
];

export function fetchOffersData() {
  // Simulated network latency so loading states are visible in the demo.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        offerModuleEnabled: true,
        features: initialFeatures,
      });
    }, 700);
  });
}
