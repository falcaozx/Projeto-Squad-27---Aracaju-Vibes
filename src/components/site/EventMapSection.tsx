import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Compass,
  Crosshair,
  MapPin,
  SlidersHorizontal,
  Ticket,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  ARACAJU_CENTER,
  calculateDistanceKm,
  formatEventDateLong,
  formatEventPrice,
  getCategoryLabel,
  useEventManager,
  type EventCategory,
  type ManagedEvent,
} from "@/lib/event-manager";

type EventMapSectionProps = {
  title: string;
  description: string;
  compact?: boolean;
  mapOnly?: boolean;
};

const eventCategories: Array<EventCategory | "all"> = [
  "all",
  "Forro",
  "Festival",
  "Pagode",
  "Sertanejo",
  "Eletronica",
];

function createMarkerIcon(active: boolean) {
  return L.divIcon({
    className: "",
    iconSize: [active ? 34 : 28, active ? 34 : 28],
    iconAnchor: [active ? 17 : 14, active ? 34 : 28],
    popupAnchor: [0, -28],
    html: `
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:${active ? 34 : 28}px;
        height:${active ? 34 : 28}px;
        border-radius:999px 999px 999px 0;
        transform:rotate(-45deg);
        background:linear-gradient(135deg, oklch(0.72 0.19 50), oklch(0.45 0.22 295));
        border:3px solid rgba(255,255,255,0.92);
        box-shadow:0 14px 28px rgba(76, 29, 149, 0.28);
      ">
        <div style="
          width:${active ? 10 : 8}px;
          height:${active ? 10 : 8}px;
          border-radius:999px;
          background:white;
          transform:rotate(45deg);
        "></div>
      </div>
    `,
  });
}

const userMarkerIcon = L.divIcon({
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: `
    <div style="
      width:18px;
      height:18px;
      border-radius:999px;
      background:oklch(0.45 0.22 295);
      border:3px solid rgba(255,255,255,0.95);
      box-shadow:0 0 0 8px rgba(109, 40, 217, 0.14);
    "></div>
  `,
});

function MapViewport({
  selectedEvent,
  filteredEvents,
  userLocation,
}: {
  selectedEvent: ManagedEvent | undefined;
  filteredEvents: ManagedEvent[];
  userLocation: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      map.invalidateSize();

      if (selectedEvent) {
        map.flyTo([selectedEvent.coords.lat, selectedEvent.coords.lng], 13, {
          duration: 1,
        });
        return;
      }

      const points = filteredEvents.map((event) => [event.coords.lat, event.coords.lng] as [number, number]);
      points.push([userLocation.lat, userLocation.lng]);
      if (points.length > 1) {
        map.fitBounds(points, { padding: [48, 48] });
      }
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [filteredEvents, map, selectedEvent, userLocation]);

  return null;
}

export function EventMapSection({
  title,
  description,
  compact = false,
  mapOnly = false,
}: EventMapSectionProps) {
  const { events } = useEventManager();
  const [isClient, setIsClient] = useState(false);
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [distanceKm, setDistanceKm] = useState(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState(ARACAJU_CENTER);

  useEffect(() => {
    setIsClient(true);

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 6000 },
    );
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = category === "all" || event.category === category;
      const matchesDistance = calculateDistanceKm(userLocation, event.coords) <= distanceKm;
      return matchesCategory && matchesDistance;
    });
  }, [category, distanceKm, events, userLocation]);

  useEffect(() => {
    if (!filteredEvents.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filteredEvents.some((event) => event.id === selectedId)) {
      setSelectedId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedId]);

  const selectedEvent = filteredEvents.find((event) => event.id === selectedId);
  const visibleEvents = mapOnly ? filteredEvents : filteredEvents.slice(0, 3);

  return (
    <section className={`mx-auto max-w-7xl px-4 ${compact ? "mt-10" : "mt-14 md:mt-16"}`}>
      <div className="relative overflow-hidden rounded-[2rem] bg-card shadow-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.72_0.16_295_/_0.18),transparent_30%),radial-gradient(circle_at_bottom_right,oklch(0.72_0.19_50_/_0.14),transparent_30%)]" />

        <div className={`relative px-6 py-8 md:px-8 ${mapOnly ? "" : "border-b border-border/70"}`}>
          {!mapOnly && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-deep">
                <Compass className="h-3.5 w-3.5" /> Eventos proximos
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                <span className="text-gradient">{title}</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">{description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px]">
              <div className="rounded-2xl bg-secondary/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ativos</div>
                <div className="mt-2 text-2xl font-bold">{filteredEvents.length}</div>
              </div>
              <div className="rounded-2xl bg-secondary/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Raio atual</div>
                <div className="mt-2 text-2xl font-bold">{distanceKm} km</div>
              </div>
              <div className="rounded-2xl bg-secondary/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cidade base</div>
                <div className="mt-2 text-2xl font-bold">Aracaju</div>
              </div>
            </div>
          </div>
          )}

          <div className={`${mapOnly ? "" : "mt-8"} grid gap-6 ${mapOnly ? "" : "lg:grid-cols-[1.1fr_1.9fr]"}`}>
            {!mapOnly && (
            <div className="rounded-[1.75rem] bg-surface p-5 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Filtros inteligentes
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {eventCategories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      category === item
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item === "all" ? "Todas" : getCategoryLabel(item)}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Distancia maxima</span>
                  <span className="text-primary">{distanceKm} km</span>
                </div>
                <Slider
                  className="mt-4"
                  min={5}
                  max={60}
                  step={5}
                  value={[distanceKm]}
                  onValueChange={(values) => setDistanceKm(values[0] ?? 20)}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-soft">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Crosshair className="h-4 w-4" /> Sua referencia atual
                </div>
                <p className="mt-2 text-sm text-white/85">
                  Estamos priorizando eventos num raio de ate {distanceKm} km da sua posicao para destacar o que esta perto agora.
                </p>
                <Link
                  to="/mapa"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-primary-deep"
                >
                  Ver mapa completo
                </Link>
              </div>
            </div>
            )}

            <div className={`grid gap-5 ${mapOnly ? "" : "xl:grid-cols-[1.5fr_0.9fr]"}`}>
              <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface-elevated shadow-soft">
                {isClient ? (
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={12}
                    scrollWheelZoom
                    className={`event-map-container ${mapOnly ? "h-[58vh] min-h-[420px] md:h-[72vh] md:min-h-[560px]" : "h-[360px] min-h-[360px] md:h-[520px] md:min-h-[520px]"} w-full`}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapViewport
                      selectedEvent={selectedEvent}
                      filteredEvents={filteredEvents}
                      userLocation={userLocation}
                    />
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon}>
                      <Popup>Voce esta aqui</Popup>
                    </Marker>

                    {filteredEvents.map((event) => (
                      <Marker
                        key={event.id}
                        position={[event.coords.lat, event.coords.lng]}
                        icon={createMarkerIcon(event.id === selectedId)}
                        eventHandlers={{ click: () => setSelectedId(event.id) }}
                      >
                        <Popup>
                          <div className="w-52">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="mb-3 h-28 w-full rounded-xl object-cover"
                            />
                            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                              {getCategoryLabel(event.category)}
                            </div>
                            <div className="mt-1 font-bold">{event.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {formatEventDateLong(event.date)} as {event.time}
                            </div>
                            <div className="mt-2 text-sm">{formatEventPrice(event.price)}</div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="flex h-[420px] items-center justify-center bg-secondary/50 md:h-[520px]">
                    <div className="text-center">
                      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                        <MapPin className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Preparando o mapa interativo...</p>
                    </div>
                  </div>
                )}
              </div>

              {mapOnly && (
                <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-[1.75rem] bg-surface p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <SlidersHorizontal className="h-4 w-4 text-primary" /> Filtros do mapa
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {eventCategories.map((item) => (
                        <button
                          key={item}
                          onClick={() => setCategory(item)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                            category === item
                              ? "bg-gradient-primary text-primary-foreground shadow-glow"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item === "all" ? "Todas" : getCategoryLabel(item)}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Distancia maxima</span>
                        <span className="text-primary">{distanceKm} km</span>
                      </div>
                      <Slider
                        className="mt-4"
                        min={5}
                        max={60}
                        step={5}
                        value={[distanceKm]}
                        onValueChange={(values) => setDistanceKm(values[0] ?? 20)}
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] bg-surface p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Compass className="h-4 w-4 text-primary" /> Resumo rapido
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-secondary/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ativos</div>
                        <div className="mt-2 text-2xl font-bold">{filteredEvents.length}</div>
                      </div>
                      <div className="rounded-2xl bg-secondary/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Raio</div>
                        <div className="mt-2 text-2xl font-bold">{distanceKm} km</div>
                      </div>
                      <div className="rounded-2xl bg-secondary/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Base</div>
                        <div className="mt-2 text-2xl font-bold">Aju</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!mapOnly && (
              <div className="space-y-4">
                {visibleEvents.length === 0 && (
                  <div className="rounded-[1.75rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
                    Nenhum evento apareceu neste raio. Aumente a distancia para explorar mais opcoes.
                  </div>
                )}

                {visibleEvents.map((event) => {
                  const distance = calculateDistanceKm(userLocation, event.coords);
                  const active = event.id === selectedId;

                  return (
                    <motion.button
                      key={event.id}
                      onClick={() => setSelectedId(event.id)}
                      whileHover={{ y: -2 }}
                      className={`w-full rounded-[1.6rem] border p-4 text-left shadow-soft transition-all ${
                        active
                          ? "border-primary/30 bg-secondary/65 shadow-glow"
                          : "border-border/70 bg-surface hover:border-primary/20"
                      }`}
                    >
                      <div className="flex gap-4">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]">
                                {getCategoryLabel(event.category)}
                              </Badge>
                              <h3 className="mt-2 text-base font-bold leading-tight">{event.title}</h3>
                            </div>
                            <span className="text-xs font-semibold text-primary">{distance.toFixed(1)} km</span>
                          </div>

                          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            <div>{formatEventDateLong(event.date)} as {event.time}</div>
                            <div>{event.venue}</div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                              <Ticket className="h-4 w-4" /> {formatEventPrice(event.price)}
                            </div>
                            <span className="text-xs text-muted-foreground">{event.city}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
