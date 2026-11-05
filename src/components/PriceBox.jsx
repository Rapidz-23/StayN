import { peso } from "../utils/price";

// Shows nightly x nights, cleaning fee, service fee and total.
export default function PriceBox({ price, serviceFeePercent = 10 }) {
  const rows = [
    [`${peso(price.nightlyRate)} x ${price.nights} night${price.nights === 1 ? "" : "s"}`, price.subtotal],
    ["Cleaning fee", price.cleaningFee],
    [`Service fee (${serviceFeePercent}%)`, price.serviceFee],
  ];
  return (
    <div style={{ fontSize: 15 }}>
      {rows.map(([label, amount]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "var(--muted)" }}>
          <span>{label}</span><span>{peso(amount)}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 8, borderTop: "1px solid var(--border)", fontWeight: 500 }}>
        <span>Total</span><span>{peso(price.total)}</span>
      </div>
    </div>
  );
}
