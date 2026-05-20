# Aracaju Vibes

**Aracaju Vibes** é uma aplicação turística moderna para explorar Aracaju e a região de Sergipe. O projeto reúne roteiros, praias, pontos turísticos, restaurantes, shows e eventos em uma interface responsiva com mapa interativo.

## Funcionalidades

- Página inicial com busca por destinos e links rápidos para categorias
- Seções de **praias**, **restaurantes**, **pontos turísticos** e **shows**
- Mapa vivo de eventos e localização de atrações
- Área de **favoritos** e **meus ingressos**
- Área para **criadores de eventos**
- Páginas de **login** e **checkout** de ingressos
- Layout responsivo com navegação superior e inferior

## Estrutura do projeto

- `src/routes/` - rotas principais da aplicação
- `src/components/` - componentes reutilizáveis, layout e UI
- `src/data.ts` - dados de atrações e pontos turísticos
- `src/lib/` - utilitários, autenticação e gerenciamento de estado
- `src/assets/` - imagens e recursos visuais

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- Radix UI
- Framer Motion
- Leaflet / React Leaflet
- React Hook Form
- Zod
- Cloudflare Wrangler (configuração de deploy)

## Scripts

- `npm install` - instala dependências
- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera build de produção
- `npm run preview` - pré-visualiza o build gerado
- `npm run lint` - checa problemas de lint
- `npm run format` - formata o código com Prettier

## Como rodar

```bash
npm install
npm run dev
```

Abra o navegador em `http://localhost:5173` para ver a aplicação.

## Deploy

Este projeto inclui configuração de `wrangler.jsonc`, então também pode ser publicado usando Cloudflare Pages ou Workers conforme necessário.

## Observações

O design é focado em oferecer uma experiência turística completa para quem visita Aracaju, com ênfase em cultura local, gastronomia e passeios ao ar livre.
