import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed, Waves, Ticket, User } from "lucide-react";
import { useAuth } from "@/lib/auth";

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/restaurantes", label: "Comer", icon: UtensilsCrossed },
  { to: "/praias", label: "Praias", icon: Waves },
  { to: "/shows", label: "Shows", icon: Ticket },
  { to: "/conta", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-2 py-2 shadow-elevated">
          {tabs.map((t) => {
            const target = t.to === "/conta" ? (user ? "/conta" : "/login") : t.to;
            const active = pathname === target;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={target}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2"
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-semibold ${active ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
