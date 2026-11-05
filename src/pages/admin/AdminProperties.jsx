import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Tab, Tabs, TextField } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useData } from "../../context/DataContext";
import { peso } from "../../utils/price";

const tabs = [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["inactive", "Hidden"]];

// One document line: opens the uploaded file, or shows the name when it is only a sample.
function DocLink({ label, doc }) {
  if (!doc) return <div style={{ color: "#B23A1B" }}>{label}: missing</div>;
  return <div>{label}: {doc.url ? <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>View</a> : <span title={doc.name}>on file</span>}</div>;
}

export default function AdminProperties() {
  const { properties, applications, listingFees, setPropertyStatus, deleteProperty } = useData();
  const [tab, setTab] = useState("pending");
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [removing, setRemoving] = useState(null);
  const list = properties.filter((p) => p.status === tab);
  const idOf = (p) => applications.find((a) => a.id === p.hostId)?.idDocument || null;
  const feeOf = (p) => listingFees.find((f) => f.propertyId === p.id);
  // A property can only be approved when both documents are on file.
  const docsOk = (p) => Boolean(p.titleDocument && idOf(p));

  return (
    <>
      <PageHeading title="Properties" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid var(--border)", mb: 3 }}>
        {tabs.map(([v, l]) => <Tab key={v} value={v} label={`${l} (${properties.filter((p) => p.status === v).length})`} sx={{ textTransform: "none" }} />)}
      </Tabs>
      {list.length === 0 ? <EmptyState title="Nothing here" message="No properties with this status." /> : (
        <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="table align-middle mb-0" style={{ minWidth: 1100 }}>
            <thead><tr><th style={{ paddingLeft: 20 }}>Property</th><th>Category</th><th>Host</th><th>Destination</th><th>Rate</th><th>Documents</th><th>Listing fee</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td style={{ paddingLeft: 20 }}>{p.title}</td><td>{p.type}</td><td>{p.hostName}</td><td>{p.destination}</td><td>{peso(p.nightlyRate)}</td>
                  <td style={{ fontSize: 13 }}>
                    <DocLink label="Title" doc={p.titleDocument} />
                    <DocLink label="ID" doc={idOf(p)} />
                  </td>
                  <td style={{ fontSize: 13 }}>{feeOf(p) ? <>{peso(feeOf(p).amount)} <StatusBadge status={feeOf(p).status} /></> : <span style={{ color: "var(--muted)" }}>None</span>}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}>
                    <Button size="small" component={Link} to={`/property/${p.id}`}>View</Button>
                    {p.status === "pending" && <>
                      <Button size="small" disabled={!docsOk(p)} onClick={() => setPropertyStatus(p.id, "approved")}>Approve</Button>
                      <Button size="small" color="error" onClick={() => { setRejecting(p); setReason(""); }}>Reject</Button>
                    </>}
                    {p.status === "approved" && <Button size="small" onClick={() => setPropertyStatus(p.id, "inactive")}>Hide</Button>}
                    {p.status === "inactive" && <Button size="small" onClick={() => setPropertyStatus(p.id, "approved")}>Show</Button>}
                    <Button size="small" color="error" onClick={() => setRemoving(p)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(rejecting)}
        title={`Reject ${rejecting?.title}?`}
        confirmLabel="Reject property"
        danger
        confirmDisabled={!reason.trim()}
        onClose={() => setRejecting(null)}
        onConfirm={() => { setPropertyStatus(rejecting.id, "rejected", reason.trim()); setRejecting(null); }}
      >
        <TextField fullWidth multiline minRows={3} label="Reason (the host will see this)" value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mt: 1 }} />
      </ConfirmDialog>
      <ConfirmDialog
        open={Boolean(removing)}
        title={`Remove ${removing?.title}?`}
        message="This deletes the property for good."
        confirmLabel="Remove"
        danger
        onClose={() => setRemoving(null)}
        onConfirm={() => { deleteProperty(removing.id); setRemoving(null); }}
      />
    </>
  );
}
