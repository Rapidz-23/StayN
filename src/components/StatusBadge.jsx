import { Chip } from "@mui/material";

// Colors come from the "Status colors (badges)" table in StayN-Design-Tokens.
const STYLES = {
  pending: ["Pending", "#FFF1D6", "#8A5A00"],
  awaiting_payment: ["Waiting for payment", "#E3F2EF", "#146C60"],
  approved: ["Approved", "#E3F2EF", "#146C60"],
  confirmed: ["Confirmed", "#146C60", "#FFFFFF"],
  completed: ["Completed", "#ECECEC", "#232323"],
  rejected: ["Rejected", "#FBE4DD", "#B23A1B"],
  cancelled: ["Cancelled", "#FBE4DD", "#B23A1B"],
  inactive: ["Inactive", "#ECECEC", "#232323"],
  active: ["Active", "#146C60", "#FFFFFF"],
  suspended: ["Suspended", "#FBE4DD", "#B23A1B"],
  deactivated: ["Deactivated", "#ECECEC", "#232323"],
  paid: ["Paid", "#E3F2EF", "#146C60"],
  refunded: ["Refunded", "#FFF1D6", "#8A5A00"],
  visible: ["Visible", "#146C60", "#FFFFFF"],
  hidden: ["Hidden", "#ECECEC", "#232323"],
};

export default function StatusBadge({ status }) {
  const [label, bg, color] = STYLES[status] || [status, "#ECECEC", "#232323"];
  return <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 500, borderRadius: "999px" }} />;
}
