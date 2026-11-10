import { z } from 'zod';
import axiosClient from '../../../api/axiosClient';

export const PLATFORM_STATUS_OPTIONS = ['Active', 'Maintenance', 'Disabled'];

export const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹) - Indian Rupee' },
  { value: 'USD', label: 'USD ($) - US Dollar' },
  { value: 'EUR', label: 'EUR (€) - Euro' },
  { value: 'GBP', label: 'GBP (£) - British Pound' },
  { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
];

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: '(GMT+5:30) India Standard Time (IST)' },
  { value: 'Asia/Dubai', label: '(GMT+4:00) Gulf Standard Time (GST)' },
  { value: 'UTC', label: '(GMT+0:00) Coordinated Universal Time (UTC)' },
  { value: 'America/New_York', label: '(GMT-5:00) Eastern Time (ET)' },
];

export const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 10/11/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 11/10/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-11-10)' },
];

export const TIME_FORMAT_OPTIONS = [
  { value: '12 Hour', label: '12-Hour (e.g. 02:30 PM)' },
  { value: '24 Hour', label: '24-Hour (e.g. 14:30)' },
];

export const platformSettingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required.'),
  logoUrl: z.string().optional().nullable(),
  logoFile: z.any().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  faviconFile: z.any().optional().nullable(),
  platformStatus: z.enum(PLATFORM_STATUS_OPTIONS).default('Active'),
  maintenanceEnabled: z.boolean().default(false),
  maintenanceMessage: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  supportEmail: z.string().optional().nullable(),
  supportPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  copyrightText: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  dateFormat: z.string().optional().nullable(),
  timeFormat: z.string().optional().nullable(),
  platformWebsiteEnabled: z.boolean().default(true),
  restaurantWebsiteAvailability: z.boolean().default(true),
});

export async function fetchPlatformSettings() {
  const res = await axiosClient.get('/platform-settings');
  const data = res?.data || res;
  return {
    platformName: data?.platformName || 'Tablly',
    logoUrl: data?.logoUrl || '',
    faviconUrl: data?.faviconUrl || '',
    platformStatus: data?.platformStatus || (data?.maintenanceEnabled ? 'Maintenance' : 'Active'),
    maintenanceEnabled: Boolean(data?.maintenanceEnabled),
    maintenanceMessage: data?.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon.',
    companyName: data?.companyName || '',
    supportEmail: data?.supportEmail || '',
    supportPhone: data?.supportPhone || '',
    address: data?.address || '',
    websiteUrl: data?.websiteUrl || '',
    copyrightText: data?.copyrightText || '',
    currency: data?.currency || 'INR',
    timezone: data?.timezone || 'Asia/Kolkata',
    dateFormat: data?.dateFormat || 'DD/MM/YYYY',
    timeFormat: data?.timeFormat || '12 Hour',
    platformWebsiteEnabled: data?.platformWebsiteEnabled !== false,
    restaurantWebsiteAvailability: data?.restaurantWebsiteAvailability !== false,
    ...data,
  };
}

export async function savePlatformSettings(values) {
  const formData = new FormData();
  formData.append('platformName', values.platformName || 'Tablly');
  formData.append('platformStatus', values.platformStatus || 'Active');
  formData.append('maintenanceEnabled', String(Boolean(values.maintenanceEnabled)));
  formData.append('maintenanceMessage', values.maintenanceMessage || '');
  
  if (values.logoFile) {
    formData.append('logo', values.logoFile);
  } else if (values.logoUrl !== undefined && !values.logoUrl.startsWith('blob:')) {
    formData.append('logoUrl', values.logoUrl);
  }

  if (values.faviconFile) {
    formData.append('favicon', values.faviconFile);
  } else if (values.faviconUrl !== undefined && !values.faviconUrl.startsWith('blob:')) {
    formData.append('faviconUrl', values.faviconUrl);
  }

  const optionalFields = [
    'companyName',
    'supportEmail',
    'supportPhone',
    'address',
    'websiteUrl',
    'copyrightText',
    'currency',
    'timezone',
    'dateFormat',
    'timeFormat',
  ];
  optionalFields.forEach((field) => {
    if (values[field] !== undefined && values[field] !== null) {
      formData.append(field, values[field]);
    }
  });

  if (values.platformWebsiteEnabled !== undefined) {
    formData.append('platformWebsiteEnabled', String(Boolean(values.platformWebsiteEnabled)));
  }
  if (values.restaurantWebsiteAvailability !== undefined) {
    formData.append('restaurantWebsiteAvailability', String(Boolean(values.restaurantWebsiteAvailability)));
  }

  const res = await axiosClient.put('/platform-settings', formData);
  return res?.data || res;
}
