import { Link } from "react-router-dom";

const destinations = ["Tagaytay", "Cebu", "Palawan", "Siargao"];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <h3>StayN</h3>
            <p className="mb-1">Your home away from home.</p>
            <p className="mb-0">Made for local stays across the Philippines.</p>
          </div>
          <div className="col-6 col-md-4">
            <h3>Explore</h3>
            <ul>
              {destinations.map((d) => (
                <li key={d}><Link to={`/explore?destination=${d}`}>{d}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h3>StayN</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/become-host">Become a host</Link></li>
              <li><a href="mailto:hello@stayn.ph">hello@stayn.ph</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 StayN. A college project.</div>
      </div>
    </footer>
  );
}
