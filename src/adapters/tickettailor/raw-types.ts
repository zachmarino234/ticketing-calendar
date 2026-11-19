
type TicketTailorBoolean = 'true' | 'false'

export interface TicketTailorList<T> {
    data: T[]
    links: {
        next: string | null
        previous: string | null
    }
}

export interface TicketTailorDateTime {
    date: string
    formatted: string
    iso: string
    time: string
    timezone: string
    unix: number
}

export interface TicketTailorTicketType {
    id: string
    name: string
    quantity: number
    quantity_issued: number
    quantity_total: number
}

export interface TicketTailorEvent {
    id: string
    event_series_id: string
    name: string
    description: string
    url: string
    start: TicketTailorDateTime
    end: TicketTailorDateTime
    timezone: string
    checkout_url: string
    hidden: TicketTailorBoolean
    private: TicketTailorBoolean
    unavailable: TicketTailorBoolean
    ticket_types: TicketTailorTicketType[]
    tickets_available: TicketTailorBoolean
    max_tickets_sold_per_occurrence: number | null
    total_issued_tickets: number
    total_holds: number
}