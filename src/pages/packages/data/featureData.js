export const packageFeatureGroups = [
  {
    group: "QR Features",
    features: [
      { id: "qr", name: "QR Functionality", description: "Basic QR code for menu scanning" },
      { id: "premium_qr", name: "Premium QR", description: "Custom branded QR code with advanced design" },
      { id: "additional_qr", name: "Additional/Paid QR", description: "Extra QR codes for different purposes" },
    ],
  },
  {
    group: "Website",
    features: [
      { id: "website", name: "Restaurant Website", description: "Dedicated restaurant website with customizable theme" },
      { id: "inquiry", name: "Inquiry Form", description: "Contact and inquiry form for customer requests" },
    ],
  },
  {
    group: "Marketing",
    features: [
      { id: "offers", name: "Offer Module", description: "Create and manage special offers and promotions" },
      { id: "google_review", name: "Google Review", description: "Integrated Google review collection and display" },
    ],
  },
];

export const getAllFeatures = () => {
  return packageFeatureGroups.flatMap((group) => group.features);
};

export const getFeatureById = (id) => {
  return getAllFeatures().find((f) => f.id === id);
};