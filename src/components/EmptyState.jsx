import { Typography } from "@mui/material";

export default function EmptyState({ title, message, action }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 16px", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 12 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>{title}</Typography>
      {message && <Typography color="text.secondary" sx={{ mb: action ? 2 : 0 }}>{message}</Typography>}
      {action}
    </div>
  );
}
