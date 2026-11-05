import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import PropertyCard from "../../components/PropertyCard";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";
import { overlaps } from "../../utils/dates";

// A stay is free when no active booking or blocked range overlaps the chosen dates.
export function isAvailable(property, bookings, checkIn, checkOut) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return true;
  const busy = bookings.some((b) => b.propertyId === property.id && ["pending", "awaiting_payment", "confirmed"].includes(b.status) && overlaps(checkIn, checkOut, b.checkIn, b.checkOut));
  const blocked = property.blockedRanges.some((r) => overlaps(checkIn, checkOut, r.start, r.end));
  return !busy && !blocked;
}

export default function Explore() {
  const { properties, bookings } = useData();
  const [params, setParams] = useSearchParams();
  const f = {
    destination: params.get("destination") || "", type: params.get("type") || "", checkIn: params.get("checkIn") || "", checkOut: params.get("checkOut") || "",
    adults: Number(params.get("adults")) || 0, kids: Number(params.get("kids")) || 0, pets: Number(params.get("pets")) || 0, maxPrice: params.get("maxPrice") || "",
  };

  const results = useMemo(() => properties.filter((p) =>
    p.status === "approved" &&
    (!f.destination || p.destination === f.destination) &&
    (!f.type || p.type === f.type) &&
    p.maxGuests >= f.adults + f.kids &&
    (p.maxPets || 0) >= f.pets &&
    (!f.maxPrice || p.nightlyRate <= Number(f.maxPrice)) &&
    isAvailable(p, bookings, f.checkIn, f.checkOut)
  ), [properties, bookings, f.destination, f.type, f.adults, f.kids, f.pets, f.maxPrice, f.checkIn, f.checkOut]);

  const onSearch = (v) => {
    const q = {};
    Object.entries(v).forEach(([k, val]) => { if (val) q[k] = val; });
    setParams(q);
  };

  return (
    <div className="container">
      <Typography variant="h2" component="h1" sx={{ mb: 3 }}>{f.type ? `${f.type} stays` : "Explore stays"}</Typography>
      <div className="mb-4"><SearchBar key={params.toString()} value={f} onSearch={onSearch} compact /></div>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{results.length} {results.length === 1 ? "stay" : "stays"} found</Typography>
      {results.length === 0 ? (
        <EmptyState title="No stays match" message="Try other dates, a higher price, or a different destination." />
      ) : (
        <div className="row g-4">
          {results.map((p) => <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={p.id}><PropertyCard property={p} /></div>)}
        </div>
      )}
    </div>
  );
}
