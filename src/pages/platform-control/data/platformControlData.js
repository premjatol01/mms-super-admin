import { z } from 'zod';

// Replace `fetchPlatformSettings` / `savePlatformSettings` with real API calls
// once the backend is wired up. The shapes below are what the rest of the
// module expects.

export const PLATFORM_STATUS_OPTIONS = ['Active', 'Maintenance', 'Disabled'];

export const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'AED', label: 'AED - UAE Dirham' },
];

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'America/New_York', label: 'America/New_York (ET)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PT)' },
];

export const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export const TIME_FORMAT_OPTIONS = [
  { value: '12 Hour', label: '12 Hour' },
  { value: '24 Hour', label: '24 Hour' },
];

const initialSettings = {
  // General Settings
  platformName: 'Menu Management System',
  logoUrl: '',
  faviconUrl: '',
  platformStatus: 'Active',

  // Platform Information
  companyName: 'ABC Technologies',
  supportEmail: 'support@example.com',
  supportPhone: '+91 98765 43210',
  address: '4th Floor, Tech Park, Bengaluru, India',
  websiteUrl: 'https://example.com',
  copyrightText: '© 2026 Menu Management System',

  // Website Configuration
  platformWebsiteEnabled: true,
  restaurantWebsiteAvailability: true,

  // System Preferences
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12 Hour',

  // Maintenance Mode
  maintenanceEnabled: false,
  maintenanceMessage: 'Platform is temporarily unavailable. Please try again later.',
};

export function fetchPlatformSettings() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...initialSettings }), 700);
  });
}

export function savePlatformSettings(values) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...values }), 600);
  });
}

const phoneRegex = /^\+?[0-9][0-9\s-]{6,14}[0-9]$/;

export const platformSettingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required.'),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  platformStatus: z.enum(PLATFORM_STATUS_OPTIONS),

  companyName: z.string().min(1, 'Company name is required.'),
  supportEmail: z.string().min(1, 'Support email is required.').email('Invalid email address.'),
  supportPhone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), 'Enter a valid phone number.'),
  address: z.string().optional(),
  websiteUrl: z.string().min(1, 'Website URL is required.').url('Enter a valid URL, e.g. https://example.com'),
  copyrightText: z.string().optional(),

  platformWebsiteEnabled: z.boolean(),
  restaurantWebsiteAvailability: z.boolean(),

  currency: z.string().min(1),
  timezone: z.string().min(1),
  dateFormat: z.string().min(1),
  timeFormat: z.string().min(1),

  maintenanceEnabled: z.boolean(),
  maintenanceMessage: z.string().optional(),
});
