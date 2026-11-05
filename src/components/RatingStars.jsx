import StarIcon from "@mui/icons-material/Star";

export default function RatingStars({ avg, count, showCount = true }) {
  if (!count) return <span style={{ color: "var(--muted)", fontSize: 14 }}>New</span>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14 }}>
      <StarIcon sx={{ fontSize: 18, color: "#FFB347" }} />
      <strong style={{ fontWeight: 500 }}>{avg.toFixed(1)}</strong>
      {showCount && <span style={{ color: "var(--muted)" }}>({count})</span>}
    </span>
  );
}
