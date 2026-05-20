import { motion } from "framer-motion";
import { Heart, Star, MapPin, Clock } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useState } from "react";
import { MapModal } from "./MapModal";

export type PlaceCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  rating?: number;
  address?: string;
  hours?: string;
  badge?: string;
  coords?: { lat: number; lng: number };
  onClick?: () => void;
};

export function PlaceCard(p: PlaceCardProps) {
  const { has, toggle } = useFavorites();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const fav = has(p.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl bg-card shadow-soft hover:shadow-elevated transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/60 via-transparent to-transparent" />

        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
            {p.badge}
          </span>
        )}

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(p.id); }}
          aria-label="Favoritar"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass-strong transition-transform hover:scale-110 active:scale-95"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-accent text-accent" : "text-foreground"}`} />
        </button>

        {typeof p.rating === "number" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full glass-strong px-2.5 py-1 text-xs font-semibold">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {p.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold tracking-tight">{p.title}</h3>
        {p.subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{p.subtitle}</p>}
        {(p.address || p.hours) && (
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {p.address && (
              <button 
                onClick={(e) => {
                  if (p.coords) {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMapOpen(true);
                  }
                }}
                className={`inline-flex items-center gap-1 text-left ${p.coords ? "hover:text-accent transition-colors" : ""}`}
              >
                <MapPin className="h-3 w-3 shrink-0" />
                <span className={p.coords ? "underline decoration-accent/30 underline-offset-2" : ""}>
                  {p.address}
                </span>
              </button>
            )}
            {p.hours && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 shrink-0" />{p.hours}</span>}
          </div>
        )}
      </div>

      {p.coords && (
        <MapModal 
          isOpen={isMapOpen} 
          onClose={() => setIsMapOpen(false)} 
          title={p.title} 
          coords={p.coords} 
        />
      )}
    </motion.article>
  );
}
