import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PageHeading from "../../components/PageHeading";
import EmptyState from "../../components/EmptyState";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatLong } from "../../utils/dates";

export default function Notifications() {
  const { notifications, markRead, markAllRead } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const mine = notifications.filter((n) => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <PageHeading
        title="Notifications"
        subtitle={unread ? `${unread} unread` : "You're all caught up."}
        action={unread > 0 && <Button onClick={() => markAllRead(user.id)}>Mark all as read</Button>}
      />
      {mine.length === 0 ? <EmptyState title="No notifications yet" message="Updates about your bookings will show up here." /> : mine.map((n) => (
        <div
          key={n.id}
          className="panel"
          role="button"
          tabIndex={0}
          onClick={() => { markRead(n.id); if (n.link) navigate(n.link); }}
          onKeyDown={(e) => e.key === "Enter" && (markRead(n.id), n.link && navigate(n.link))}
          style={{ padding: 16, marginBottom: 12, cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", background: n.read ? "var(--surface)" : "#F4FAF8" }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 5, marginTop: 7, flexShrink: 0, background: n.read ? "transparent" : "var(--accent)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>{n.title}</div>
            <div style={{ color: "var(--muted)", fontSize: 15 }}>{n.message}</div>
          </div>
          <span style={{ color: "var(--muted)", fontSize: 13, whiteSpace: "nowrap" }}>{formatLong(n.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}
