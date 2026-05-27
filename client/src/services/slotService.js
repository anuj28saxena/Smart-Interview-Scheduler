import { apiRequest } from '../api/httpClient';
import { buildQueryString } from '../utils/queryString';

export function getSlots(filters = {}) {
  const query = buildQueryString(filters);
  return apiRequest(`/slots${query}`);
}

export function createSlot(payload) {
  return apiRequest('/slots', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateSlot(id, payload) {
  return apiRequest(`/slots/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function deleteSlot(id) {
  return apiRequest(`/slots/${id}`, { method: 'DELETE' });
}
