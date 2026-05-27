import { apiRequest } from '../api/httpClient';
import { buildQueryString } from '../utils/queryString';

export function getDashboardSummary() {
  return apiRequest('/bookings/dashboard/summary');
}

export function getBookings(filters = {}) {
  const query = buildQueryString(filters);
  return apiRequest(`/bookings${query}`);
}

export function bookSlot(slotId) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify({ slotId })
  });
}

export function cancelBooking(id) {
  return apiRequest(`/bookings/${id}/cancel`, { method: 'PATCH' });
}

export function rescheduleBooking(id, newSlotId) {
  return apiRequest(`/bookings/${id}/reschedule`, {
    method: 'PATCH',
    body: JSON.stringify({ newSlotId })
  });
}
