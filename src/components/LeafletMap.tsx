"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Machine } from "@/lib/types";

function markerIcon(status: Machine["status"]) {
  return L.divIcon({
    className: `bg-marker ${
      status === "live" ? "bg-marker-live" : "bg-marker-coming"
    }`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

export default function LeafletMap({ machines }: { machines: Machine[] }) {
  const center: [number, number] =
    machines.length > 0
      ? [machines[0].lat, machines[0].lng]
      : [-33.8688, 151.2093]; // Sydney CBD

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      style={{ minHeight: "420px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {machines.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={markerIcon(m.status)}>
          <Popup>
            <strong>{m.venue_name}</strong>
            <br />
            {m.address}, {m.suburb}
            <br />
            <span style={{ textTransform: "uppercase", fontSize: "11px" }}>
              {m.status === "live" ? "Live now" : "Coming soon"}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
