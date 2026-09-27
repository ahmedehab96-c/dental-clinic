// Single source of truth for appointment status logic — every component
// that needs to know "what statuses exist" or "what can this status become"
// reads from here instead of hardcoding it locally.
export const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

// Which status an appointment can be moved to from its current one. Order
// matters — it's also the display order of the action buttons.
export const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export function canTransitionTo(currentStatus, targetStatus) {
  return (STATUS_TRANSITIONS[currentStatus] ?? []).includes(targetStatus)
}
