import { apiClient } from './client'

// Adapts the Laravel ClinicSettingResource shape to camelCase.
function mapClinicSettings(raw) {
  if (!raw) return null

  return {
    address: raw.address,
    phone: raw.phone,
    whatsapp: raw.whatsapp,
    email: raw.email,
    workingHours: raw.working_hours,
    socialLinks: raw.social_links ?? {},
    ogImage: raw.default_og_image_url,
    map: raw.map,
  }
}

/**
 * @returns {Promise<object>}
 */
export async function fetchClinicSettings() {
  const { data } = await apiClient.get('/clinic-settings')
  return mapClinicSettings(data)
}
