import { Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PageHeading from "../../components/PageHeading";
import RatingStars from "../../components/RatingStars";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function HostReviews() {
  const { user } = useAuth();
  const { properties, reviews, ratingOf } = useData();
  const mine = properties.filter((p) => p.hostId === user.id);
  const list = reviews.filter((r) => r.hostId === user.id && r.visible);

  return (
    <>
      <PageHeading title="Reviews" />
      <div className="row g-3 mb-4">
        {mine.map((p) => {
          const { avg, count } = ratingOf(p.id);
          return (
            <div className="col-12 col-md-6 col-xl-4" key={p.id}>
              <div className="panel" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>{p.title}</span><RatingStars avg={avg} count={count} />
              </div>
            </div>
          );
        })}
      </div>
      {list.length === 0 ? <EmptyState title="No reviews yet" message="Guests can review after a completed stay." /> : list.map((r) => (
        <div key={r.id} className="panel" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span><strong style={{ fontWeight: 500 }}>{r.guestName}</strong> <span style={{ color: "var(--muted)" }}>on {properties.find((p) => p.id === r.propertyId)?.title}</span></span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><StarIcon sx={{ fontSize: 18, color: "#FFB347" }} />{r.rating}</span>
          </div>
          <Typography color="text.secondary">{r.comment}</Typography>
        </div>
      ))}
    </>
  );
}
