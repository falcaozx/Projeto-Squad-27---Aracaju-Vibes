import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">Aracaju Turismo</div>
                <div className="text-[10px] text-muted-foreground tracking-[0.18em] uppercase">Experiências reais</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Tudo o que você precisa para viver Aracaju como ninguém: praias, gastronomia, cultura e os melhores shows.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Explorar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/praias" className="hover:text-primary transition-colors">Praias</Link></li>
              <li><Link to="/restaurantes" className="hover:text-primary transition-colors">Restaurantes</Link></li>
              <li><Link to="/bares" className="hover:text-primary transition-colors">Bares</Link></li>
              <li><Link to="/pontos-turisticos" className="hover:text-primary transition-colors">Pontos Turísticos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Eventos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shows" className="hover:text-primary transition-colors">Shows & Festivais</Link></li>
              <li><Link to="/meus-ingressos" className="hover:text-primary transition-colors">Meus Ingressos</Link></li>
              <li><Link to="/mapa" className="hover:text-primary transition-colors">Mapa interativo</Link></li>
              <li><Link to="/criador-eventos" className="hover:text-primary transition-colors">Dashboard do promotor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Siga-nos</h4>
            <div className="flex gap-2">
              {[Instagram, Facebook, Youtube, Mail].map((I, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary-deep hover:bg-gradient-primary hover:text-primary-foreground transition-all">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground flex flex-col md:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Aracaju Turismo. Todos os direitos reservados.</span>
          <span>Feito com ♥ em Sergipe</span>
        </div>
      </div>
    </footer>
  );
}
