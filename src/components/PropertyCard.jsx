import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import Photo from "./Photo";
import RatingStars from "./RatingStars";
import { useData } from "../context/DataContext";
import { peso } from "../utils/price";

export default function PropertyCard({ property }) {
  const { ratingOf } = useData();
  const { avg, count } = ratingOf(property.id);
  return (
    <Card
      component={Link}
      to={`/property/${property.id}`}
      sx={{ display: "block", textDecoration: "none", color: "inherit", p: 1.5, transition: "box-shadow .15s", "&:hover": { boxShadow: "var(--shadow-card-hover)" } }}
    >
      <Photo tone={property.tone} label={property.images?.[0] ? property.title : property.type} src={property.images?.[0]} />
      <CardContent sx={{ px: 0.5, pb: "4px !important" }}>
        <Typography variant="h3" noWrap sx={{ fontSize: 18 }}>{property.title}</Typography>
        <Typography variant="body2" color="text.secondary">{property.type} in {property.destination}</Typography>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <Typography sx={{ fontWeight: 500 }}>{peso(property.nightlyRate)} <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 14 }}>/ night</span></Typography>
          <RatingStars avg={avg} count={count} showCount={false} />
        </div>
      </CardContent>
    </Card>
  );
}
