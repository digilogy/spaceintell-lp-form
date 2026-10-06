export interface Park {
  id: string;
  name: string;
  subtitle?: string;
  highlights?: string;
  location: string;
  corridor: string;
  status: "Ready to Occupy" | "Under Development" | "Upcoming";
  statusColor: "green" | "amber" | "steel" | "white/60";
  type: string;
  area?: string;
  access?: string;
  industries?: string;
  featured: boolean; // Parks 1-3 get editorial layout; 4-9 get table row
}

export const parksData: Park[] = [
  // ── Featured parks (editorial 60/40 layout) ──────────────────────────────
  {
    id: "omr",
    name: "Casagrand Industrial, OMR",
    subtitle: "Chennai's IT and electronics corridor",
    highlights: "Built to Suit · End-to-End Support · Multimodal Connectivity",
    location: "Paiyanur, One Hub, OMR, Chennai",
    corridor: "OMR / Paiyanur",
    status: "Ready to Occupy",
    statusColor: "green",
    type: "Ready-Built Factories & Warehousing",
    area: "Leasable area starts from 25000 Sq. ft.",
    access: "5 min to OMR; 35 min to Chennai Port; direct NH-32 access",
    industries: "Electronics, IT hardware, light manufacturing, logistics",
    featured: true,
  },
  {
    id: "poonamallee",
    name: "Casagrand Industrial, Poonamallee",
    subtitle: "Chennai's western logistics gateway",
    highlights: "Plug and Play · Easy Truck Access · Ample Parking",
    location: "Poonamallee / Pillaipakkam, Bangalore Highway, Chennai",
    corridor: "Poonamallee / Pillaipakkam",
    status: "Ready to Occupy",
    statusColor: "green",
    type: "Ready-Built Factories",
    area: "Leasable area starts from 25000 Sq. ft.",
    access: "NH-48 Bangalore Highway; 40 min to Chennai airport",
    industries: "Automobile ancillary, engineering, FMCG",
    featured: true,
  },
  {
    id: "sriperumbudur-1",
    name: "Casagrand Industrial, Sriperumbudur – I",
    subtitle: "At the heart of Chennai's auto and electronics belt",
    highlights: "Approvals in Place · Safety-First Design · 24/7 Security & Surveillance",
    location: "Pillaipakkam, Sriperumbudur, Chennai",
    corridor: "Sriperumbudur / Sunguvarchatram",
    status: "Under Development",
    statusColor: "amber",
    type: "Integrated Industrial Park",
    area: "Leasable area starts from 25000 Sq. ft.",
    access: "Chennai–Bangalore Corridor (NH-48); SIPCOT proximity",
    industries: "Automobile OEM / ancillary, electronics, EV components",
    featured: true,
  },
  // ── Secondary parks (data table) ─────────────────────────────────────────
  {
    id: "sriperumbudur-2",
    name: "Casagrand Industrial Park — Sriperumbudur II",
    location: "Santhavellore, Sunguvarchatram, Chennai",
    corridor: "Sriperumbudur / Sunguvarchatram",
    status: "Under Development",
    statusColor: "amber",
    type: "Integrated Industrial Park",
    access: "NH-48; 45 km from Chennai port",
    industries: "Automobile, heavy engineering",
    featured: false,
  },
  {
    id: "sriperumbudur-3",
    name: "Casagrand Industrial Park — Sriperumbudur III",
    location: "Sriperumbudur, Chennai–Bangalore Corridor",
    corridor: "Sriperumbudur / Sunguvarchatram",
    status: "Under Development",
    statusColor: "amber",
    type: "Large-Format Industrial Park",
    access: "NH-48; direct SIPCOT access road",
    industries: "OEM manufacturing, supply-chain hub",
    featured: false,
  },
  {
    id: "oragadam",
    name: "Casagrand Industrial Park — Oragadam",
    location: "Walajabad, Oragadam Corridor, Chennai",
    corridor: "Oragadam / Walajabad",
    status: "Under Development",
    statusColor: "amber",
    type: "Integrated Industrial Park",
    access: "Oragadam Industrial Corridor; 60 km from Chennai port",
    industries: "Automobile, heavy engineering, FMCG",
    featured: false,
  },
  {
    id: "kiadb",
    name: "Casagrand Industrial Park — KIADB Bengaluru",
    location: "KIADB Aerospace & Hardware Park, North Bengaluru",
    corridor: "North Bengaluru (KIADB)",
    status: "Under Development",
    statusColor: "amber",
    type: "Aerospace & Hardware Industrial Park",
    access: "20 km from KIA; direct NH-44 access",
    industries: "Aerospace, electronics, precision engineering",
    featured: false,
  },
  {
    id: "coimbatore",
    name: "Casagrand Industrial Park — Coimbatore",
    location: "Palladam–Cochin Frontier Road, Coimbatore",
    corridor: "Palladam–Cochin Frontier",
    status: "Under Development",
    statusColor: "amber",
    type: "Industrial & Warehousing Park",
    access: "NH-544 Coimbatore–Cochin; 30 km to Coimbatore airport",
    industries: "Textile machinery, pumps, industrial components",
    featured: false,
  },
  {
    id: "vallam",
    name: "Casagrand Industrial Park — Vallam",
    location: "SIPCOT Vallam, Oragadam Corridor",
    corridor: "Oragadam / Walajabad",
    status: "Upcoming",
    statusColor: "white/60",
    type: "SIPCOT Integrated Park",
    access: "Adjacent to SIPCOT Vallam; NH access",
    industries: "Auto, engineering, logistics",
    featured: false,
  },
];

export const featuredParks = parksData.filter((p) => p.featured);
export const secondaryParks = parksData.filter((p) => !p.featured);
