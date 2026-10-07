export interface Corridor {
  id: string;
  city: "Chennai" | "Bengaluru" | "Coimbatore";
  name: string;
  parks: number;
  highlight: string;
}

export const corridors: Corridor[] = [
  {
    id: "sriperumbudur",
    city: "Chennai",
    name: "Sriperumbudur / Sunguvarchatram",
    parks: 3,
    highlight: "Largest automobile & electronics corridor in South India. Home to Hyundai, Dell, Kia, Flextronics.",
  },
  {
    id: "oragadam",
    city: "Chennai",
    name: "Oragadam / Walajabad",
    parks: 2,
    highlight: "South India's fastest-growing heavy industrial corridor. Renault-Nissan, Apollo Tyres, Daimler.",
  },
  {
    id: "poonamallee",
    city: "Chennai",
    name: "Poonamallee / Pillaipakkam",
    parks: 1,
    highlight: "NH-48 Bangalore Highway corridor. Strong connectivity to Chennai airport and port.",
  },
  {
    id: "omr",
    city: "Chennai",
    name: "OMR / Paiyanur",
    parks: 1,
    highlight: "Ready-to-occupy parks. Ideal for electronics, IT hardware, and light manufacturing.",
  },
  {
    id: "bengaluru",
    city: "Bengaluru",
    name: "North Bengaluru — KIADB",
    parks: 1,
    highlight: "KIADB Aerospace & Hardware Park. 20 km from Kempegowda International Airport.",
  },
  {
    id: "coimbatore",
    city: "Coimbatore",
    name: "Palladam — Cochin Frontier",
    parks: 1,
    highlight: "NH-544. Hub for textile machinery, pump engineering, and renewable energy components.",
  },
];
