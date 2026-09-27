import { z } from 'zod';
import axiosClient from '../../../api/axiosClient';

export const PLATFORM_STATUS_OPTIONS = ['Active', 'Maintenance', 'Disabled'];

export const platformSettingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required.'),
  logoUrl: z.string().optional(),
  logoFile: z.any().optional(),
  faviconUrl: z.string().optional(),
  faviconFile: z.any().optional(),
  platformStatus: z.enum(PLATFORM_STATUS_OPTIONS),
  maintenanceEnabled: z.boolean(),
  maintenanceMessage: z.string().optional(),
});

export async function fetchPlatformSettings() {
  const res = await axiosClient.get('/platform-settings');
  return res.data || {
    platformName: 'Menu Management System',
    logoUrl: '',
    faviconUrl: '',
    platformStatus: 'Active',
    maintenanceEnabled: false,
    maintenanceMessage: '',
  };
}

export async function savePlatformSettings(values) {
  const formData = new FormData();
  formData.append('platformName', values.platformName);
  formData.append('platformStatus', values.platformStatus);
  formData.append('maintenanceEnabled', values.maintenanceEnabled);
  if (values.maintenanceMessage) formData.append('maintenanceMessage', values.maintenanceMessage);
  
  if (values.logoFile) {
    formData.append('logo', values.logoFile);
  } else if (values.logoUrl && !values.logoUrl.startsWith('blob:')) {
    formData.append('logoUrl', values.logoUrl);
  }

  if (values.faviconFile) {
    formData.append('favicon', values.faviconFile);
  } else if (values.faviconUrl && !values.faviconUrl.startsWith('blob:')) {
    formData.append('faviconUrl', values.faviconUrl);
  }

  const res = await axiosClient.put('/platform-settings', formData);
  return res.data;
}
