// Dates are kept as YYYY-MM-DD text so date math stays simple.
export const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const parseISO = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (days, from = new Date()) => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() + days);
  return toISO(d);
};

export const todayISO = () => toISO(new Date());

export const nightsBetween = (checkIn, checkOut) =>
  Math.round((parseISO(checkOut) - parseISO(checkIn)) / 86400000);

// Two stays overlap when each starts before the other ends (check-out day is free).
export const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

export const formatShort = (iso) =>
  parseISO(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric" });

export const formatLong = (iso) =>
  parseISO(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

export const formatRange = (checkIn, checkOut) => `${formatShort(checkIn)} to ${formatShort(checkOut)}`;
