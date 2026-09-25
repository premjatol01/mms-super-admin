// Temporary mock data — remove once the real API endpoints are wired up.

export const MOCK_RESTAURANTS = [
  { id: "r1", name: "The Green Fork" },
  { id: "r2", name: "Spice Route Kitchen" },
  { id: "r3", name: "Blue Anchor Grill" },
  { id: "r4", name: "Cafe Meridian" },
  { id: "r5", name: "Nolan's Diner" },
];

export const MOCK_QR_CODES = [
  {
    id: "qr1",
    name: "Table Ordering – Default",
    description: "Standard QR placed on all dine-in tables for menu access.",
    imageUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=table-ordering-default",
    assignment: "all",
    restaurantId: null,
    status: "active",
    createdAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "qr2",
    name: "Spice Route – Diwali Offer",
    description: "Promotional QR linking to the festive season menu.",
    imageUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=diwali-offer",
    assignment: "restaurant",
    restaurantId: "r2",
    status: "inactive",
    createdAt: "2026-08-01T09:30:00.000Z",
  },
  {
    id: "qr3",
    name: "Feedback Kiosk",
    description: "",
    imageUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=feedback-kiosk",
    assignment: "all",
    restaurantId: null,
    status: "active",
    createdAt: "2026-09-02T14:15:00.000Z",
  },
];
