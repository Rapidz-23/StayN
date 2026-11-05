import { useState } from "react";
import { Button, Tab, Tabs } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";

export default function AdminHosts() {
  const { applications, properties, setApplication, updateApplication, updateUser } = useData();
  const [tab, setTab] = useState("applications");
  const pending = applications.filter((a) => a.status === "pending");
  const hosts = applications.filter((a) => ["approved", "deactivated"].includes(a.status));

  // Deactivating removes host access; reactivating restores it.
  const deactivate = (a) => { updateApplication(a.id, { status: "deactivated" }); updateUser(a.id, { role: "guest" }); };
  const reactivate = (a) => { updateApplication(a.id, { status: "approved" }); updateUser(a.id, { role: "host" }); };

  return (
    <>
      <PageHeading title="Hosts" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid var(--border)", mb: 3 }}>
        <Tab value="applications" label={`Applications (${pending.length})`} sx={{ textTransform: "none" }} />
        <Tab value="hosts" label="Hosts" sx={{ textTransform: "none" }} />
      </Tabs>

      {tab === "applications" ? (
        pending.length === 0 ? <EmptyState title="No applications" message="New host applications will show up here." /> : (
          <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
            <table className="table align-middle mb-0" style={{ minWidth: 900 }}>
              <thead><tr><th style={{ paddingLeft: 20 }}>Applicant</th><th>Phone</th><th>Address</th><th>Bio</th><th>ID</th><th>House certificate</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
              <tbody>
                {pending.map((a) => (
                  <tr key={a.id}>
                    <td style={{ paddingLeft: 20 }}>{a.fullName}</td><td>{a.phone}</td><td>{a.address}</td><td>{a.bio}</td>
                    <td>{a.idDocument ? <a href={a.idDocument.url || "#"} target={a.idDocument.url ? "_blank" : undefined} rel="noreferrer" style={{ color: "var(--primary)" }}>{a.idDocument.name}</a> : "—"}</td>
                    <td>{a.houseCertificate ? <a href={a.houseCertificate.url || "#"} target={a.houseCertificate.url ? "_blank" : undefined} rel="noreferrer" style={{ color: "var(--primary)" }}>{a.houseCertificate.name}</a> : "—"}</td>
                    <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}>
                      <Button size="small" variant="contained" onClick={() => setApplication(a.id, "approved")}>Approve</Button>{" "}
                      <Button size="small" variant="outlined" color="inherit" sx={{ borderColor: "var(--border)" }} onClick={() => setApplication(a.id, "rejected")}>Reject</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="table align-middle mb-0" style={{ minWidth: 640 }}>
            <thead><tr><th style={{ paddingLeft: 20 }}>Host</th><th>Properties</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
            <tbody>
              {hosts.map((a) => (
                <tr key={a.id}>
                  <td style={{ paddingLeft: 20 }}>{a.fullName}</td>
                  <td>{properties.filter((p) => p.hostId === a.id).length}</td>
                  <td><StatusBadge status={a.status === "approved" ? "active" : "deactivated"} /></td>
                  <td style={{ paddingRight: 20 }}>
                    {a.status === "approved"
                      ? <Button size="small" color="error" onClick={() => deactivate(a)}>Deactivate</Button>
                      : <Button size="small" onClick={() => reactivate(a)}>Reactivate</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
