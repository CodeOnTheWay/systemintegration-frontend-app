
"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    async function initializeMap() {
      const container = mapRef.current;
      if (!container) return;

      const L = await import("leaflet");

      if (cancelled || !mapRef.current) return;

      // Remove an old Leaflet instance before creating another.
      const existingMap = L.DomUtil.get(container);
      if (existingMap && (existingMap as any)._leaflet_id) {
        delete (existingMap as any)._leaflet_id;
      }

      map = L.map(container).setView([8.157, 125.127], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([8.157, 125.127])
        .addTo(map)
        .bindPopup("Malaybalay City, Bukidnon")
        .openPopup();
    }

    initializeMap().catch((error) => {
      console.error("Map initialization failed:", error);
    });

    return () => {
      cancelled = true;
      map?.remove();
      map = undefined;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height: "320px", width: "100%" }}
    />
  );
}
