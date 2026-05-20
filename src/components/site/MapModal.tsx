import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Create a beautiful modern custom marker
const customIcon = L.divIcon({
  html: `<div style="
    background: linear-gradient(135deg, hsl(230, 80%, 65%), hsl(280, 80%, 60%)); 
    width: 28px; 
    height: 28px; 
    border-radius: 50% 50% 50% 0; 
    transform: rotate(-45deg); 
    border: 3px solid white; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  "></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

export type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  coords: { lat: number; lng: number };
};

export function MapModal({ isOpen, onClose, title, coords }: MapModalProps) {
  // Add a slight delay to ensure the map renders correctly within the dialog
  // as Leaflet sometimes struggles with container sizes when inside modals
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl overflow-hidden p-0 border-0 h-[80vh] sm:h-[600px] flex flex-col rounded-3xl">
        <div className="p-6 pb-4 z-10 bg-background/80 backdrop-blur-md absolute top-0 left-0 right-0">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm">Localização no mapa interativo</DialogDescription>
        </div>
        
        <div className="flex-1 w-full relative h-full">
          {isOpen && (
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
              style={{ minHeight: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[coords.lat, coords.lng]} icon={customIcon}>
                <Popup className="font-semibold text-sm">
                  {title}
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
