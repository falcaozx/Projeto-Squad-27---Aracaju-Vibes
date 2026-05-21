import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { DivIcon } from "leaflet";

type ReactLeafletMapComponents = {
  MapContainer: any;
  TileLayer: any;
  Marker: any;
  Popup: any;
} | null;

export type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  coords: { lat: number; lng: number };
};

export function MapModal({ isOpen, onClose, title, coords }: MapModalProps) {
  const [customIcon, setCustomIcon] = useState<DivIcon | null>(null);
  const [mapComponents, setMapComponents] = useState<ReactLeafletMapComponents>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([import("leaflet"), import("react-leaflet")]).then(([leaflet, reactLeaflet]) => {
      setCustomIcon(
        leaflet.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, hsl(230, 80%, 65%), hsl(280, 80%, 60%));
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          "></div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        }),
      );

      setMapComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
      });
    });
  }, []);

  useEffect(() => {
    if (!(isOpen && mapInstance)) return;

    const timeoutId = window.setTimeout(() => {
      mapInstance.invalidateSize();
      mapInstance.setView([coords.lat, coords.lng], 16, { animate: false });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [coords.lat, coords.lng, isOpen, mapInstance]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[80vh] flex-col overflow-hidden rounded-3xl border-0 p-0 sm:h-[600px] sm:max-w-3xl">
        <div className="absolute left-0 right-0 top-0 z-10 bg-background/80 p-6 pb-4 backdrop-blur-md">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm">Localização no mapa interativo</DialogDescription>
        </div>

        <div className="relative h-full w-full flex-1">
          {isOpen && mapComponents ? (
            (() => {
              const { MapContainer, TileLayer, Marker, Popup } = mapComponents;
              return (
                <MapContainer
                  key={`${coords.lat}-${coords.lng}-${title}`}
                  center={[coords.lat, coords.lng]}
                  zoom={16}
                  scrollWheelZoom
                  whenCreated={setMapInstance}
                  className="h-full w-full z-0"
                  style={{ minHeight: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[coords.lat, coords.lng]} icon={customIcon ?? undefined}>
                    <Popup className="font-semibold text-sm">{title}</Popup>
                  </Marker>
                </MapContainer>
              );
            })()
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
