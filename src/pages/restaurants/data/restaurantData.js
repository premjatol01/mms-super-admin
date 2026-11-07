export const initialRestaurants = [
  {
    id: "1",
    name: "Spice Garden",
    logo: null,
    description: "A fine dining restaurant serving authentic Indian cuisine",
    admin: { name: "John Doe", email: "john@spicegarden.com", phone: "+91 9876543210" },
    address: { city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400001", fullAddress: "123 Marine Drive" },
    subscription: { package: "Premium", status: "active", startDate: "2024-01-01", endDate: "2024-12-31" },
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "The Burger Joint",
    logo: null,
    description: "Best burgers in town with premium ingredients",
    admin: { name: "Sarah Smith", email: "sarah@burgerjoint.com", phone: "+91 9876543211" },
    address: { city: "Delhi", state: "Delhi", country: "India", pincode: "110001", fullAddress: "45 Connaught Place" },
    subscription: { package: "Basic", status: "active", startDate: "2024-03-01", endDate: "2024-05-31" },
    status: "active",
    createdAt: "2024-03-01",
  },
  {
    id: "3",
    name: "Pizza Paradise",
    logo: null,
    description: "Authentic Italian pizzas with fresh ingredients",
    admin: { name: "Mike Johnson", email: "mike@pizzaparadise.com", phone: "+91 9876543212" },
    address: { city: "Bangalore", state: "Karnataka", country: "India", pincode: "560001", fullAddress: "78 MG Road" },
    subscription: { package: "Standard", status: "expired", startDate: "2023-06-01", endDate: "2023-12-31" },
    status: "inactive",
    createdAt: "2023-06-01",
  },
  {
    id: "4",
    name: "Taj Dhaba",
    logo: null,
    description: "Traditional Indian dhaba style food",
    admin: { name: "Raj Patel", email: "raj@tajdhaba.com", phone: "+91 9876543213" },
    address: { city: "Ahmedabad", state: "Gujarat", country: "India", pincode: "380001", fullAddress: "12 CG Road" },
    subscription: { package: "Premium", status: "active", startDate: "2024-02-15", endDate: "2025-02-14" },
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: "5",
    name: "Sea Food Harbor",
    logo: null,
    description: "Fresh seafood with ocean view",
    admin: { name: "Anna Williams", email: "anna@seafoodharbor.com", phone: "+91 9876543214" },
    address: { city: "Chennai", state: "Tamil Nadu", country: "India", pincode: "600001", fullAddress: "23 Marina Beach" },
    subscription: { package: "Basic", status: "pending", startDate: null, endDate: null },
    status: "inactive",
    createdAt: "2024-04-10",
  },
];

export const subscriptionPackages = [
  { 
    value: "Basic", 
    label: "Basic", 
    name: "Basic",
    maxTables: 15,
    pricing: [
      { duration: "1_month", durationDays: 30, durationDisplay: "1 Month (30 Days)", price: 999 },
      { duration: "6_months", durationDays: 180, durationDisplay: "6 Months (180 Days)", price: 4999 },
      { duration: "12_months", durationDays: 365, durationDisplay: "12 Months / 1 Year", price: 8999, isPopular: true },
    ]
  },
  { 
    value: "Standard", 
    label: "Standard", 
    name: "Standard",
    maxTables: 50,
    pricing: [
      { duration: "1_month", durationDays: 30, durationDisplay: "1 Month (30 Days)", price: 2499 },
      { duration: "6_months", durationDays: 180, durationDisplay: "6 Months (180 Days)", price: 12499 },
      { duration: "12_months", durationDays: 365, durationDisplay: "12 Months / 1 Year", price: 22999, isPopular: true },
    ]
  },
  { 
    value: "Premium", 
    label: "Premium", 
    name: "Premium",
    maxTables: 150,
    pricing: [
      { duration: "1_month", durationDays: 30, durationDisplay: "1 Month (30 Days)", price: 4999 },
      { duration: "6_months", durationDays: 180, durationDisplay: "6 Months (180 Days)", price: 24999 },
      { duration: "12_months", durationDays: 365, durationDisplay: "12 Months / 1 Year", price: 44999, isPopular: true },
    ]
  },
];

export const platformFeatures = [
  { id: "qr", name: "QR Code", enabled: true },
  { id: "premium-qr", name: "Premium QR", enabled: true },
  { id: "website", name: "Restaurant Website", enabled: true },
  { id: "inquiry", name: "Inquiry Form", enabled: true },
  { id: "offers", name: "Offers", enabled: true },
  { id: "google-review", name: "Google Review", enabled: false },
];