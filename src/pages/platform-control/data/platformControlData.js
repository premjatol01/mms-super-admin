import { z } from 'zod';
import axiosClient from '../../../api/axiosClient';

export const PLATFORM_STATUS_OPTIONS = ['Active', 'Maintenance', 'Disabled'];

export const platformSettingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required.'),
  logoUrl: z.string().optional().nullable(),
  logoFile: z.any().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  faviconFile: z.any().optional().nullable(),
  platformStatus: z.enum(PLATFORM_STATUS_OPTIONS).default('Active'),
  maintenanceEnabled: z.boolean().default(false),
  maintenanceMessage: z.string().optional().nullable(),
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

  const res = await axiosClient.put('/platform-settings', formData);
  return res?.data || res;
}
