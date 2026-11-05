import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MapView({ lat, lng, onPick, height = 280 }) {
  if (!key) {
    return <GoogleMapEmbed lat={lat} lng={lng} height={height} />;
  }
  return <LiveMap lat={lat} lng={lng} onPick={onPick} height={height} />;
}

function GoogleMapEmbed({ lat, lng, height }) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  return (
    <div style={{ height, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
      <iframe
        title="Google map"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

function LiveMap({ lat, lng, onPick, height }) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: key });
  if (!isLoaded) return <GoogleMapEmbed lat={lat} lng={lng} height={height} />;
  return (
    <GoogleMap
      mapContainerStyle={{ height, borderRadius: 12 }}
      center={{ lat, lng }}
      zoom={14}
      onClick={onPick ? (e) => onPick({ lat: e.latLng.lat(), lng: e.latLng.lng() }) : undefined}
    >
      <MarkerF position={{ lat, lng }} />
    </GoogleMap>
  );
}
