export const initialPackages = [
  { name: "Basic", id: "PKG-001", duration: 30, durationDisplay: "30 Days", features: ["qr", "website"], description: "Essential features for small restaurants" },
  { name: "Standard", id: "PKG-002", duration: 90, durationDisplay: "90 Days", features: ["qr", "premium_qr", "website", "inquiry", "offers", "google_review"], description: "Complete solution for growing restaurants" },
  { name: "Premium", id: "PKG-003", duration: 365, durationDisplay: "1 Year", features: ["qr", "premium_qr", "additional_qr", "website", "inquiry", "offers", "google_review"], description: "Advanced features for established restaurants" },
];

export const getAllPackages = () => {
  return initialPackages.filter(p => p);
};

export const getPackageById = (id) => {
  return initialPackages.find(p => p.id === id);
};

export const getPackageByName = (name) => {
  return initialPackages.find(p => p.name.toLowerCase() === name.toLowerCase());
};