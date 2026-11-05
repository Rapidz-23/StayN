import { useState } from "react";
import { Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";

export default function AdminReviews() {
  const { reviews, properties, updateReview, deleteReview } = useData();
  const [target, setTarget] = useState(null);

  return (
    <>
      <PageHeading title="Reviews" />
      {reviews.length === 0 ? <EmptyState title="No reviews" /> : (
        <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="table align-middle mb-0" style={{ minWidth: 800 }}>
            <thead><tr><th style={{ paddingLeft: 20 }}>Property</th><th>Guest</th><th>Rating</th><th>Comment</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td style={{ paddingLeft: 20 }}>{properties.find((p) => p.id === r.propertyId)?.title}</td>
                  <td>{r.guestName}</td>
                  <td><StarIcon sx={{ fontSize: 16, color: "#FFB347", verticalAlign: "-2px" }} /> {r.rating}</td>
                  <td>{r.comment}</td>
                  <td><StatusBadge status={r.visible ? "visible" : "hidden"} /></td>
                  <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}>
                    <Button size="small" onClick={() => updateReview(r.id, { visible: !r.visible })}>{r.visible ? "Hide" : "Show"}</Button>
                    <Button size="small" color="error" onClick={() => setTarget(r)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={Boolean(target)} title="Delete this review?" message="This removes the review for good." confirmLabel="Delete" danger onClose={() => setTarget(null)} onConfirm={() => { deleteReview(target.id); setTarget(null); }} />
    </>
  );
}
