import type { TicketTailorList, TicketTailorEvent } from './raw-types'
import type { Performance, AvailabilityStatus } from '../../core/types'

// Given a TicketTailorEvent, return its availability status for display in the UI.
export function getStatus(event: TicketTailorEvent): AvailabilityStatus {
    const remaining = event.ticket_types.reduce((sum, type) => sum + type.quantity, 0)
    const capacity = event.ticket_types.reduce((sum, type) => sum + type.quantity_total, 0)
    if (event.hidden === 'true' || event.unavailable === 'true') {
        return 'off_sale'
    }
    if (event.tickets_available === 'false' || remaining <= 0) {
        return 'sold_out'
    }
    if (capacity > 0 && remaining / capacity <= 0.25) {
        return 'limited'
    }
    return 'available'
}

// Convert a TicketTailorEvent to a Performance for use in the app.
function toPerformance(event: TicketTailorEvent): Performance {
  return {
    id: event.id,
    showId: event.event_series_id,
    startsAt: event.start.iso,
    timezone: event.timezone,
    status: getStatus(event),
    bookingUrl: event.checkout_url
  }
}

// Convert a TicketTailorList of TicketTailorEvents to an array of Performances for use in the app. Maps each event to a Performance and sorts them by start time.
export function toPerformances(raw: TicketTailorList<TicketTailorEvent>): Performance[] {
    return raw.data.map(toPerformance).sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}
