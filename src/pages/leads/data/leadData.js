export const initialLeads = [
  {
    id: "LD-001",
    restaurantName: "Rajputana Restaurant",
    address: {
      fullAddress: "Main Market, Near Bus Stand",
      city: "Barmer",
      state: "Rajasthan",
      pincode: "344001"
    },
    contactPerson: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@rajputana.com",
    restaurantType: "Fine Dining",
    website: "https://rajputana.com",
    stage: "qualified",
    status: "active",
    notes: "Interested in QR menu and restaurant website. Requested pricing information.",
    createdAt: "2026-09-12",
    updatedAt: "2026-09-12",
    convertedRestaurantId: null,
    activity: [
      { date: "2026-09-12", action: "Lead created" },
      { date: "2026-09-13", action: "Stage changed to Contacted" },
      { date: "2026-09-15", action: "Stage changed to Qualified" }
    ]
  },
  {
    id: "LD-002",
    restaurantName: "Hotel Marwar",
    address: {
      fullAddress: "Hospital Road, Jodhpur",
      city: "Jodhpur",
      state: "Rajasthan",
      pincode: "342001"
    },
    contactPerson: "Priya Singh",
    phone: "9876543222",
    email: "priya@hotelmarwar.com",
    restaurantType: "Hotel Restaurant",
    website: "",
    stage: "new_lead",
    status: "active",
    notes: "New lead from trade show. Looking for digital menu solutions.",
    createdAt: "2026-09-14",
    updatedAt: "2026-09-14",
    convertedRestaurantId: null,
    activity: [
      { date: "2026-09-14", action: "Lead created" }
    ]
  },
  {
    id: "LD-003",
    restaurantName: "City View Restaurant",
    address: {
      fullAddress: "Rooftop, City Mall, Ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001"
    },
    contactPerson: "Amit Patel",
    phone: "9876543233",
    email: "amit@cityview.co.in",
    restaurantType: "Casual Dining",
    website: "https://cityview.co.in",
    stage: "interested",
    status: "active",
    notes: "Very interested in QR menu feature. Wants to see demo.",
    createdAt: "2026-09-10",
    updatedAt: "2026-09-16",
    convertedRestaurantId: null,
    activity: [
      { date: "2026-09-10", action: "Lead created" },
      { date: "2026-09-11", action: "Stage changed to Contacted" },
      { date: "2026-09-13", action: "Stage changed to Qualified" },
      { date: "2026-09-16", action: "Stage changed to Interested" }
    ]
  },
  {
    id: "LD-004",
    restaurantName: "Desi Dhaba",
    address: {
      fullAddress: "Highway Road, Udaipur",
      city: "Udaipur",
      state: "Rajasthan",
      pincode: "313001"
    },
    contactPerson: "Ramesh Kumar",
    phone: "9876543244",
    email: "",
    restaurantType: "Quick Bites",
    website: "",
    stage: "prospect",
    status: "active",
    notes: "Small dhaba interested in growing business.",
    createdAt: "2026-09-15",
    updatedAt: "2026-09-15",
    convertedRestaurantId: null,
    activity: [
      { date: "2026-09-15", action: "Lead created" }
    ]
  },
  {
    id: "LD-005",
    restaurantName: "The Spice Garden",
    address: {
      fullAddress: "MG Road, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001"
    },
    contactPerson: "Sneha Rao",
    phone: "9876543255",
    email: "sneha@spicegarden.com",
    restaurantType: "Fine Dining",
    website: "https://spicegarden.in",
    stage: "follow_up",
    status: "active",
    notes: "Follow up scheduled for next week. Needs custom pricing.",
    createdAt: "2026-09-08",
    updatedAt: "2026-09-17",
    convertedRestaurantId: null,
    activity: [
      { date: "2026-09-08", action: "Lead created" },
      { date: "2026-09-09", action: "Stage changed to Contacted" },
      { date: "2026-09-12", action: "Stage changed to Qualified" },
      { date: "2026-09-14", action: "Stage changed to Interested" },
      { date: "2026-09-17", action: "Stage changed to Follow-up" }
    ]
  },
  {
    id: "LD-006",
    restaurantName: "Taj Mahal Cafe",
    address: {
      fullAddress: "Near Taj Mahal, Agra",
      city: "Agra",
      state: "Uttar Pradesh",
      pincode: "282001"
    },
    contactPerson: "Vikram Singh",
    phone: "9876543266",
    email: "vikram@tajmahalcafe.com",
    restaurantType: "Cafe",
    website: "",
    stage: "converted",
    status: "active",
    notes: "Converted to restaurant.",
    createdAt: "2026-08-20",
    updatedAt: "2026-09-01",
    convertedRestaurantId: "R-001",
    activity: [
      { date: "2026-08-20", action: "Lead created" },
      { date: "2026-08-22", action: "Stage changed to Contacted" },
      { date: "2026-08-25", action: "Stage changed to Qualified" },
      { date: "2026-08-28", action: "Stage changed to Interested" },
      { date: "2026-09-01", action: "Lead converted to Restaurant" }
    ]
  },
  {
    id: "LD-007",
    restaurantName: "Sea Food Paradise",
    address: {
      fullAddress: "Marine Drive, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    contactPerson: "Anita Desai",
    phone: "9876543277",
    email: "anita@seafoodparadise.com",
    restaurantType: "Fine Dining",
    website: "https://seafoodparadise.com",
    stage: "lost",
    status: "inactive",
    notes: "Lost to competitor. Not interested anymore.",
    createdAt: "2026-08-15",
    updatedAt: "2026-08-28",
    convertedRestaurantId: null,
    activity: [
      { date: "2026-08-15", action: "Lead created" },
      { date: "2026-08-17", action: "Stage changed to Contacted" },
      { date: "2026-08-20", action: "Stage changed to Lost" },
      { date: "2026-08-28", action: "Status changed to Inactive" }
    ]
  }
];

export const leadStages = [
  { value: "prospect", label: "Prospect", color: "#94a3b8" },
  { value: "new_lead", label: "New Lead", color: "#3b82f6" },
  { value: "contacted", label: "Contacted", color: "#8b5cf6" },
  { value: "qualified", label: "Qualified", color: "#f59e0b" },
  { value: "interested", label: "Interested", color: "#10b981" },
  { value: "follow_up", label: "Follow-up", color: "#f97316" },
  { value: "converted", label: "Converted", color: "#22c55e" },
  { value: "lost", label: "Lost", color: "#ef4444" }
];

export const leadStatus = [
  { value: "active", label: "Active", color: "#22c55e" },
  { value: "inactive", label: "Inactive", color: "#94a3b8" }
];

export const stageOrder = [
  "prospect",
  "new_lead",
  "contacted",
  "qualified",
  "interested",
  "follow_up",
  "converted",
  "lost"
];

export const restaurantTypes = [
  "Fine Dining",
  "Casual Dining",
  "Quick Bites",
  "Cafe",
  "Hotel Restaurant",
  "Food Truck",
  "Bakery",
  "Bar & Restaurant"
];