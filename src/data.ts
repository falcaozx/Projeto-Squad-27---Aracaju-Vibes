import heroOrla from "@/assets/hero-orla.jpg";
import xingo from "@/assets/xingo.jpg";
import foz from "@/assets/foz.jpg";
import cangaco from "@/assets/cangaco.jpg";
import passarela from "@/assets/passarela.jpg";
import oceanario from "@/assets/oceanario.jpg";
import atalaia from "@/assets/atalaia.jpg";
import mosqueiro from "@/assets/mosqueiro.jpg";
import aruana from "@/assets/aruana.jpg";
import forro from "@/assets/forro.jpg";
import restauranteImg from "@/assets/restaurante.jpg";
import barImg from "@/assets/bar.jpg";
import marceloBritoImg from "@/assets/restaurants/marcelo-brito.webp";
import ottoImg from "@/assets/restaurants/otto.png";
import diVinoImg from "@/assets/restaurants/diVinoImg.jpg";
import oMiguelImg from "@/assets/restaurants/o-miguel.jpg";
import mykonosImg from "@/assets/restaurants/mykonos.jpg";
import fornalhasImg from "@/assets/restaurants/fornalhas.jpg";

import xingoNew from "@/assets/canions-xingo-new.png";
import fozNew from "@/assets/foz-rio-new.png";
import cangacoNew from "@/assets/barco-cangaco-new.png";
import passarelaNew from "@/assets/passarela-caranguejo-new.png";
import oceanarioNew from "@/assets/oceanario-new.png";
import mercadoNew from "@/assets/mercado-municipal-new.png";
import museuNew from "@/assets/museu-sergipana-new.png";
import croaNew from "@/assets/croa-gore-new.png";

export const images = {
  heroOrla, xingo, foz, cangaco, passarela, oceanario,
  atalaia, mosqueiro, aruana, forro, restauranteImg, barImg,
};

export type Highlight = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
};

export const highlights: Highlight[] = [
  {
    id: "barco-cangaco",
    title: "Barco do Cangaço",
    subtitle: "Passeio cultural • Rio Sergipe",
    description:
      "Navegue por histórias, viva emoções e descubra o encanto do Rio Sergipe. Reviva a história do cangaço com uma encenação emocionante a bordo.",
    image: cangacoNew,
    tag: "Cultural",
  },
  {
    id: "canions-xingo",
    title: "Cânions do Xingó",
    subtitle: "Aventura • Sertão sergipano",
    description:
      "Viaje pelo sertão até o quinto maior cânion navegável do mundo e renove suas energias em um delicioso banho nas águas do São Francisco.",
    image: xingoNew,
    tag: "Aventura",
  },
  {
    id: "foz-sao-francisco",
    title: "Foz do São Francisco",
    subtitle: "Natureza • Velho Chico",
    description:
      "Vamos ao encontro das águas do Velho Chico e o mar na divisa dos estados de Sergipe e Alagoas, desfrutando de paisagens da região.",
    image: fozNew,
    tag: "Natureza",
  },
];

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating?: number;
  address: string;
  hours: string;
  category: "Frutos do Mar" | "Regional" | "Pizzaria" | "Destaques" | "Bar";
  liveMusic?: boolean;
  image: string;
  price: "$" | "$$" | "$$$";
  coords: { lat: number; lng: number };
};

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Restaurante Marcelo Brito",
    cuisine: "Autoral • frutos do mar, massas e risotos",
    address: "Av. Dr. Sílvio Cabral Santana, 775 - Aruana",
    hours: "Todos os dias, 12h às 00h",
    category: "Frutos do Mar",
    image: marceloBritoImg,
    price: "$$$",
    coords: { lat: -11.0388, lng: -37.0717 },
  },
  {
    id: "r2",
    name: "OTTO",
    cuisine: "Contemporâneo • carnes, frutos do mar e sushi",
    address: "Rua Dr. Bezerra de Menezes, 102 - Coroa do Meio",
    hours: "Ter-Sáb 11h30-15h; Qui-Sáb 18h30+; Dom 11h30-16h",
    category: "Destaques",
    image: ottoImg,
    price: "$$$",
    coords: { lat: -10.9688, lng: -37.0408 },
  },
  {
    id: "r3",
    name: "Di Vino",
    cuisine: "Vinho & gourmet • cozinha contemporânea",
    address: "R. José Ramos da Silva, 99 - 13 de Julho",
    hours: "Seg-Sáb 12h-15h | 18h30-23h; Dom 12h-15h",
    category: "Destaques",
    image: diVinoImg,
    price: "$$$",
    coords: { lat: -10.9308, lng: -37.0478 },
  },
  {
    id: "r4",
    name: "Restaurante O Miguel",
    cuisine: "Regional sergipana • carnes e peixes",
    address: "Av. Antônio Alves, 340 - Atalaia Velha",
    hours: "Seg-Sáb 11h-16h; Dom 11h-17h",
    category: "Regional",
    image: oMiguelImg,
    price: "$$",
    coords: { lat: -10.9949, lng: -37.0439 },
  },
  {
    id: "r5",
    name: "Mykonos Restaurante",
    cuisine: "Mediterrânea • peixes, frutos do mar e carnes",
    address: "Rua Alvaro Brito, 62 - Aracaju",
    hours: "Ter-Qua 12h-16h/18h30-22h; Qui-Sáb 12h-16h/18h30-23h; Dom 12h-16h",
    category: "Destaques",
    image: mykonosImg,
    price: "$$$",
    coords: { lat: -10.9228, lng: -37.0488 },
  },
  {
    id: "r6",
    name: "Fornalhas",
    cuisine: "Pizzaria • pizzas artesanais e pratos à la carte",
    address: "Rua dos Girassóis, 12 - Inácio Barbosa",
    hours: "11h-15h e 17h-23h30",
    category: "Pizzaria",
    image: fornalhasImg,
    price: "$$",
    coords: { lat: -11.0282, lng: -37.0714 },
  },
];

export const bars: Restaurant[] = [
  { id: "b1", name: "Forró Caju", cuisine: "Forró Pé-de-Serra", rating: 4.8, address: "Centro Histórico", hours: "20h – 03h", category: "Bar", liveMusic: true, image: barImg, price: "$$", coords: { lat: -10.912, lng: -37.051 } },
  { id: "b2", name: "Beco do Tropeiro", cuisine: "Petiscos & Sertanejo", rating: 4.6, address: "Atalaia", hours: "18h – 02h", category: "Bar", liveMusic: true, image: barImg, price: "$$", coords: { lat: -11.005, lng: -37.042 } },
  { id: "b3", name: "Studio Pub", cuisine: "Cervejaria & Rock", rating: 4.7, address: "Treze de Julho", hours: "18h – 03h", category: "Bar", liveMusic: true, image: barImg, price: "$$", coords: { lat: -10.933, lng: -37.044 } },
  { id: "b4", name: "Cacique Chá", cuisine: "Coquetelaria autoral", rating: 4.9, address: "Coroa do Meio", hours: "17h – 01h", category: "Bar", liveMusic: false, image: barImg, price: "$$$", coords: { lat: -10.984, lng: -37.038 } },
];

export type Beach = {
  id: string;
  name: string;
  short: string;
  description: string;
  features: string[];
  image: string;
  coords: { lat: number; lng: number };
};

export const beaches: Beach[] = [
  { id: "atalaia", name: "Praia de Atalaia", short: "A queridinha da capital", description: "Ondas calmas a fortes, calçadão extenso com pista de cooper, ciclovia, quiosques, parques infantis e o Oceanário. Vida agitada do nascer ao pôr do sol.", features: ["Calçadão", "Quiosques", "Esportes", "Família"], image: atalaia, coords: { lat: -10.9760, lng: -37.0465 } },
  { id: "aruana", name: "Praia de Aruana", short: "Águas verdes e tranquilas", description: "Praia familiar com águas mornas e piscinas naturais na maré baixa. Excelente infraestrutura de bares à beira-mar.", features: ["Piscinas naturais", "Familiar", "Barracas"], image: aruana, coords: { lat: -11.0264, lng: -37.0601 } },
  { id: "mosqueiro", name: "Praia do Mosqueiro", short: "Sossego à beira-mar", description: "Refúgio mais ao sul com poucos quiosques, ideal para quem busca tranquilidade. Pôr do sol espetacular sobre o rio Vaza-Barris.", features: ["Sossegada", "Pôr do sol", "Pescadores"], image: mosqueiro, coords: { lat: -11.1215, lng: -37.1235 } },
  { id: "refugio", name: "Praia do Refúgio", short: "Natural e selvagem", description: "Trecho mais preservado, com dunas e vegetação nativa. Ideal para caminhadas e contemplação.", features: ["Dunas", "Natureza", "Trilhas"], image: aruana, coords: { lat: -11.0825, lng: -37.0980 } },
  { id: "naufragos", name: "Praia dos Náufragos", short: "Surf e juventude", description: "Ponto preferido dos surfistas locais, ondas mais formadas e ambiente jovem aos finais de semana.", features: ["Surf", "Jovem", "Esportes"], image: atalaia, coords: { lat: -11.0650, lng: -37.0850 } },
];

export type Attraction = {
  id: string;
  name: string;
  category: string;
  hours: string;
  price: string;
  description: string;
  image: string;
  coords: { lat: number; lng: number };
};

export const attractions: Attraction[] = [
  { id: "arcos-orla", name: "Arcos da Orla", category: "Cartão-postal", hours: "24h", price: "Gratuito", description: "Os famosos arcos coloridos da Orla de Atalaia, ícone visual da cidade e cenário obrigatório para fotos.", image: heroOrla, coords: { lat: -10.9856, lng: -37.0438 } },
  { id: "oceanario", name: "Oceanário de Aracaju", category: "Família", hours: "10h – 21h", price: "R$ 30", description: "Aquário com espécies da costa sergipana, túnel de vidro e atividades educativas para todas as idades.", image: oceanarioNew, coords: { lat: -10.9763, lng: -37.0465 } },
  { id: "passarela-caranguejo", name: "Passarela do Caranguejo", category: "Gastronomia", hours: "17h – 00h", price: "Gratuito", description: "Polo gastronômico noturno com dezenas de restaurantes especializados em frutos do mar e o famoso caranguejo.", image: passarelaNew, coords: { lat: -10.9914, lng: -37.0416 } },
  { id: "museu-sergipana", name: "Museu da Gente Sergipana", category: "Cultura", hours: "Ter–Dom 10h – 17h", price: "Gratuito", description: "Museu interativo que conta a história e cultura do povo sergipano através de tecnologia e instalações imersivas.", image: museuNew, coords: { lat: -10.9167, lng: -37.0483 } },
  { id: "mercado-municipal", name: "Mercado Municipal", category: "Compras", hours: "Seg–Sáb 06h – 18h", price: "Gratuito", description: "Tradicional mercado central com artesanato, temperos, frutas, comidas típicas e o famoso licor de jenipapo.", image: mercadoNew, coords: { lat: -10.9069, lng: -37.0505 } },
  { id: "croa-gore", name: "Croa do Goré", category: "Natureza", hours: "Conforme maré", price: "R$ 80 (passeio)", description: "Banco de areia que aparece na maré baixa em meio ao Rio Vaza-Barris. Almoço em barcos-restaurante.", image: croaNew, coords: { lat: -11.1272, lng: -37.1355 } },
];

export type EventItem = {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: "Forró" | "Sertanejo" | "Pagode" | "Eletrônica" | "Festival";
  price: number;
  image: string;
  coords?: { lat: number; lng: number };
};

export const events: EventItem[] = [
  { id: "e1", title: "Forrobodó de Aracaju", artist: "Mestrinho & Convidados", date: "14 Jun", time: "20:00", venue: "Centro de Eventos", city: "Aracaju", category: "Forró", price: 80, image: forro, coords: { lat: -10.9472, lng: -37.0731 } },
  { id: "e2", title: "Forró Caju 2026", artist: "Various Artists", date: "20 Jun", time: "18:00", venue: "Orla de Atalaia", city: "Aracaju", category: "Festival", price: 0, image: forro, coords: { lat: -11.0028, lng: -37.0428 } },
  { id: "e3", title: "Noite Sertaneja", artist: "Henrique & Juliano", date: "05 Jul", time: "22:00", venue: "Arena Batistão", city: "Aracaju", category: "Sertanejo", price: 180, image: forro, coords: { lat: -10.925, lng: -37.058 } },
  { id: "e4", title: "Pagode na Praia", artist: "Dilsinho", date: "12 Jul", time: "21:00", venue: "Beach Stage Atalaia", city: "Aracaju", category: "Pagode", price: 120, image: forro, coords: { lat: -11.010, lng: -37.045 } },
  { id: "e5", title: "Tropical Electronic", artist: "Vintage Culture", date: "26 Jul", time: "23:00", venue: "Hangar Sergipe", city: "Aracaju", category: "Eletrônica", price: 220, image: forro, coords: { lat: -10.975, lng: -37.050 } },
];
