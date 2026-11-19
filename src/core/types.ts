export type AvailabilityStatus =
  | "available"
  | "limited"
  | "sold_out"
  | "cancelled"
  | "off_sale"
  | "unknown";

export interface Performance {
  id: string; // the provider's ID, kept so you can link back
  showId: string;
  startsAt: string; // ISO 8601 with offset
  timezone: string; // venue's IANA zone, e.g. "America/New_York"
  status: AvailabilityStatus;
  bookingUrl: string;
}
