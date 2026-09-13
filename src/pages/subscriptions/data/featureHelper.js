// Feature definitions for subscriptions
const features = [
  { id: "qr", name: "QR Functionality", description: "Basic QR code for menu scanning" },
  { id: "premium_qr", name: "Premium QR", description: "Custom branded QR code with advanced design" },
  { id: "additional_qr", name: "Additional/Paid QR", description: "Extra QR codes for different purposes" },
  { id: "website", name: "Restaurant Website", description: "Dedicated restaurant website with customizable theme" },
  { id: "inquiry", name: "Inquiry Form", description: "Contact and inquiry form for customer requests" },
  { id: "offers", name: "Offer Module", description: "Create and manage special offers and promotions" },
  { id: "google_review", name: "Google Review", description: "Integrated Google review collection and display" },
];

export const getAllFeatures = () => features;

export const getFeatureById = (id) => features.find(f => f.id === id);

export const getFeaturesByIds = (ids) => ids.map(id => getFeatureById(id)).filter(Boolean);

export const getFeaturesByPackageName = (packageName) => {
  const packageFeatures = {
    "Basic": ["qr", "website"],
    "Standard": ["qr", "premium_qr", "website", "inquiry", "offers", "google_review"],
    "Premium": ["qr", "premium_qr", "additional_qr", "website", "inquiry", "offers", "google_review"],
    "Starter": ["qr"],
  };
  const featureIds = packageFeatures[packageName] || [];
  return getFeaturesByIds(featureIds);
};