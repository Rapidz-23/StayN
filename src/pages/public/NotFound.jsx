import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import EmptyState from "../../components/EmptyState";

export function NotFound() {
  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <EmptyState title="This page wandered off." message="We could not find the page you were looking for." action={<Button component={Link} to="/" variant="contained">Home</Button>} />
    </div>
  );
}

export function NotAllowed() {
  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <EmptyState title="You don't have access to this page." message="Log in with the right account, or head back home." action={<Button component={Link} to="/" variant="contained">Home</Button>} />
    </div>
  );
}
