// "2 adults, 1 kid, 1 pet". Older bookings only have a `guests` number.
export function guestSummary(b) {
  if (b.adults === undefined) return `${b.guests} guest${b.guests === 1 ? "" : "s"}`;
  const parts = [`${b.adults} adult${b.adults === 1 ? "" : "s"}`];
  if (b.kids) parts.push(`${b.kids} kid${b.kids === 1 ? "" : "s"}`);
  if (b.pets) parts.push(`${b.pets} pet${b.pets === 1 ? "" : "s"}`);
  return parts.join(", ");
}

// Short text for the guest picker button: "3 guests, 1 pet" or "Add guests".
export function guestLabel({ adults = 0, kids = 0, pets = 0 }) {
  const guests = adults + kids;
  const parts = [];
  if (guests) parts.push(`${guests} guest${guests === 1 ? "" : "s"}`);
  if (pets) parts.push(`${pets} pet${pets === 1 ? "" : "s"}`);
  return parts.join(", ") || "Add guests";
}
