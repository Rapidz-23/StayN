import { useState } from "react";
import { Button, TextField } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { users, updateUser } = useData();
  const { user: me } = useAuth();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const list = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));

  const open = (u) => { setEdit(u); setForm({ name: u.name, phone: u.phone }); };

  return (
    <>
      <PageHeading title="Users" />
      <TextField size="small" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} sx={{ mb: 2, width: { xs: "100%", sm: 360 } }} />
      <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
        <table className="table align-middle mb-0" style={{ minWidth: 760 }}>
          <thead><tr><th style={{ paddingLeft: 20 }}>Name</th><th>Email</th><th>Role</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td style={{ paddingLeft: 20 }}>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                <td><StatusBadge status={u.status} /></td>
                <td style={{ paddingRight: 20, whiteSpace: "nowrap" }}>
                  <Button size="small" onClick={() => open(u)}>Edit</Button>
                  {u.id !== me.id && u.role !== "admin" && (
                    u.status === "active"
                      ? <Button size="small" color="error" onClick={() => updateUser(u.id, { status: "suspended" })}>Suspend</Button>
                      : <Button size="small" onClick={() => updateUser(u.id, { status: "active" })}>Activate</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(edit)}
        title={`Edit ${edit?.name}`}
        confirmLabel="Save"
        confirmDisabled={!form.name.trim()}
        onClose={() => setEdit(null)}
        onConfirm={() => { updateUser(edit.id, { name: form.name.trim(), phone: form.phone }); setEdit(null); }}
      >
        <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mt: 1, mb: 2 }} />
        <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </ConfirmDialog>
    </>
  );
}
