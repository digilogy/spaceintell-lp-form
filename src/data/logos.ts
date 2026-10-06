export interface CompanyLogo {
  name: string;
  image: string;
}

export interface LogoCategory {
  category: string;
  companies: CompanyLogo[];
}

export const tenantLogos: LogoCategory[] = [
  {
    category: "Automobile & Auto Ancillary",
    companies: [
      { name: "KLT Automotive", image: "/asset/KLT Automotive.png" },
      { name: "Nexteer Automotive", image: "/asset/Nexteer Automotive.png" },
      { name: "Kohitech", image: "/asset/Kohitech.png" },
      { name: "ECCT / BYD", image: "/asset/ECCT.png" },
      { name: "VinFast", image: "/asset/VinFast.png" },
      { name: "Royal Enfield", image: "/asset/Royal Enfield.png" },
    ],
  },
  {
    category: "Electronics & Technology",
    companies: [
      { name: "Pegatron", image: "/asset/Pegatron.png" },
      { name: "Hitachi ABB", image: "/asset/Hitachi ABB(1).png" },
      { name: "NCR", image: "/asset/NCR_logo_color.svg.webp" }, // Using Hitachi ABB(1) for NCR if applicable, or fallback
      { name: "Sercomm", image: "/asset/Sercomm.png" },
      { name: "Wangda Technologies", image: "/asset/Wangda Technologies.png" },
      { name: "HRS (Hirose)", image: "/asset/HRS (Hirose).png" },
    ],
  },
  {
    category: "Manufacturing & Engineering",
    companies: [
      { name: "Cooper Standard", image: "/asset/Cooper Standard.png" },
      { name: "Deceuninck Belgium", image: "/asset/Deceuninck Belgium.png" },
      { name: "Krishca Strapping", image: "/asset/Krishca Strapping.png" },
      { name: "Nirmiti Group", image: "/asset/Nirmiti Group.png" },
      { name: "Arvos Group", image: "/asset/Arvos Group.png" },
      { name: "KRR", image: "/asset/KRR.png" },
    ],
  },
  {
    category: "Renewable Energy · Logistics · Software",
    companies: [
      { name: "Acciona Wind", image: "/asset/Acciona Wind.png" },
      { name: "Eickhoff Wind Energy", image: "/asset/Eickhoff Wind Energy.png" },
      { name: "Flender Drives", image: "/asset/Flender Drives.png" },
      { name: "Indutch Composites", image: "/asset/Indutch Composite.png" },
      { name: "Coldman Warehousing", image: "/asset/Coldman Warehousing.png" },
      { name: "Iron Mountain", image: "/asset/Iron Mountain.png" },
    ],
  },
];
