import { Typography } from "@mui/material";

// Page title with an optional action button on the right.
export default function PageHeading({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <div>
        <Typography variant="h2" component="h1">{title}</Typography>
        {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
      </div>
      {action}
    </div>
  );
}
