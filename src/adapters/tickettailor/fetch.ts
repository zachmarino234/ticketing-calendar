export async function fetchEvents() {
  const res = await fetch('/api/tt/events')
  if (!res.ok) throw new Error(`Ticket Tailor ${res.status}`)
  return res.json()
}