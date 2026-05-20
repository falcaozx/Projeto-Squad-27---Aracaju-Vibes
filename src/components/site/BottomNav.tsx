import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Map, Ticket, User, UtensilsCrossed, Waves } from "lucide-react";
import { useAuth } from "@/lib/auth";

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/restaurantes", label: "Comer", icon: UtensilsCrossed },
  { to: "/praias", label: "Praias", icon: Waves },
  { to: "/shows", label: "Shows", icon: Ticket },
  { to: "/mapa", label: "Mapa", icon: Map },
  { to: "/conta", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1000] md:hidden">
      <div className="mx-auto max-w-xl px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-1.5 py-2 shadow-elevated">
          {tabs.map((tab) => {
            const target = tab.to === "/conta" ? (user ? "/conta" : "/login") : tab.to;
            const active = pathname === target;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.to}
                to={target}
                className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2"
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span
                  className={`truncate text-[9px] font-semibold ${
                    active ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
