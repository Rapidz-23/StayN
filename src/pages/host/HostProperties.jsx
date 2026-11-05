import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Switch } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import Photo from "../../components/Photo";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { peso } from "../../utils/price";
import { todayISO } from "../../utils/dates";

export default function HostProperties() {
  const { user } = useAuth();
  const { properties, bookings, settings, setPropertyStatus, deleteProperty } = useData();
  const [target, setTarget] = useState(null);
  const mine = properties.filter((p) => p.hostId === user.id);

  // A property with open or future bookings cannot be deleted.
  const hasOpenBookings = (p) => bookings.some((b) => b.propertyId === p.id && ["pending", "awaiting_payment", "confirmed"].includes(b.status) && b.checkOut >= todayISO());

  return (
    <>
      <PageHeading title="My Properties" action={<Button component={Link} to="/host/properties/new" variant="contained">Add property</Button>} />
      {mine.length === 0 ? (
        <EmptyState title="No properties yet" message={`Add your first property. A one-time listing fee of ${peso(settings.listingFee)} applies, and it goes live after the StayN team approves it.`} />
      ) : (
        <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="table align-middle mb-0" style={{ minWidth: 760 }}>
            <thead><tr><th style={{ paddingLeft: 20 }}>Property</th><th>Status</th><th>Nightly rate</th><th>Active</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p.id}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 56 }}><Photo tone={p.tone} radius={6} src={p.images?.[0]} /></div>
                      <div><div style={{ fontWeight: 500 }}>{p.title}</div><div style={{ color: "var(--muted)", fontSize: 13 }}>{p.type} · {p.destination}</div></div>
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} />{p.status === "rejected" && <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.rejectReason}</div>}</td>
                  <td>{peso(p.nightlyRate)}</td>
                  <td>
                    <Switch
                      checked={p.status === "approved"}
                      disabled={!["approved", "inactive"].includes(p.status)}
                      onChange={(e) => setPropertyStatus(p.id, e.target.checked ? "approved" : "inactive")}
                      inputProps={{ "aria-label": `Active: ${p.title}` }}
                    />
                  </td>
                  <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}>
                    <Button size="small" component={Link} to={`/host/properties/${p.id}/edit`}>Edit</Button>
                    <Button size="small" component={Link} to={`/host/properties/${p.id}/availability`}>Availability</Button>
                    <Button size="small" color="error" onClick={() => setTarget(p)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target) && !hasOpenBookings(target)}
        title={`Delete ${target?.title}?`}
        message="This removes the property for good. This cannot be undone."
        confirmLabel="Delete"
        danger
        onClose={() => setTarget(null)}
        onConfirm={() => { deleteProperty(target.id); setTarget(null); }}
      />
      <ConfirmDialog
        open={Boolean(target) && hasOpenBookings(target)}
        title="You can't delete this property"
        message="It has pending or upcoming bookings. Finish or decline them first, or switch the property to inactive instead."
        confirmLabel="Got it"
        onClose={() => setTarget(null)}
        onConfirm={() => setTarget(null)}
      />
    </>
  );
}
