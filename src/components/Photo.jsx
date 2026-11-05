// Placeholder photo tile. Real photos are added in the Firebase step (see StayN-Tech-Stack, photos).
const TONES = [
  ["#d9e8e3", "#b9d6cd"], ["#f4e3cf", "#ecc9a3"], ["#d6e4ee", "#b3cde0"], ["#e7ddf0", "#cfbfe3"],
  ["#f6dcd3", "#eebaa8"], ["#dcebd3", "#bfd9ae"], ["#f7ecc6", "#efd98e"], ["#d3ebea", "#a9d8d5"],
];

export default function Photo({ tone = 0, ratio = "4 / 3", radius = 12, label, sx = {}, height, src }) {
  const [a, b] = TONES[Math.abs(tone) % TONES.length];
  // A real uploaded photo wins over the color tile.
  if (src) {
    return (
      <img
        src={src}
        alt={label || "Property photo"}
        style={{ display: "block", objectFit: "cover", width: "100%", aspectRatio: height ? undefined : ratio, height, borderRadius: radius, ...sx }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={label || "Property photo"}
      style={{
        background: `linear-gradient(135deg, ${a}, ${b})`,
        aspectRatio: height ? undefined : ratio,
        height,
        borderRadius: radius,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(35,35,35,0.35)",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        ...sx,
      }}
    >
      {label}
    </div>
  );
}
