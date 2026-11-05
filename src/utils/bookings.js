import { todayISO } from "./dates";

// A guest can review once the stay is over (a paid booking whose check-out date has passed counts too).
export const canReview = (b) => ["confirmed", "completed"].includes(b.status) && b.checkOut <= todayISO();
