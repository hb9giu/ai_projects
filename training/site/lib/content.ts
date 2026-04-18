export const profile = {
  name: "Lajos Nyerges",
  title: "Global Supply Chain · Integrated Insights & Planning",
  location: "Ramlinsburg, Basel-Landschaft, Switzerland",
  tagline:
    "Demand planning, SAP APO, and ERP strategy at enterprise scale — from engineering roots to Roche.",
  email: "lajos.nyerges@yahoo.com",
  linkedin: "https://www.linkedin.com/in/lajos-nyerges-750513142",
  photo: "/profile.svg",
  resume: "/linkedin.pdf",
} as const;

export const about = {
  lead: `I bridge supply chain operations with systems and data: from regional demand planning to SAP APO community leadership and, today, integrated insights that inform how Roche plans and executes globally.`,
  body: `My path started in integrated engineering in Hungary, moved through logistics and demand leadership at Mondelēz, and deepened at Roche — where I have spent well over a decade shaping planning capability, SAP expertise, and long-horizon ERP vision alongside cross-functional teams across Basel and beyond.`,
} as const;

export const skills = [
  "Demand planning",
  "Supply chain management",
  "SAP APO",
  "ERP vision & transformation",
  "Stakeholder alignment",
] as const;

export const languages = [
  { name: "Hungarian", level: "Native" },
  { name: "English", level: "Full professional" },
  { name: "German", level: "Limited working" },
] as const;

export const certifications = [
  "Finance for Non-Financial Managers",
  "Artificial Intelligence Foundations: Thinking Machines",
  "Machine Learning Foundations: Linear Algebra",
] as const;

export const education = [
  {
    school: "Budapest University of Technology and Economics",
    degree: "M.Sc., Integrated Engineering",
    years: "1997 — 1999",
  },
  {
    school: "Technical College of Kecskemét (GAMF)",
    degree: "B.Sc., Integrated Engineering",
    years: "1994 — 1997",
  },
] as const;

export type JourneyItem = {
  period: string;
  role: string;
  org: string;
  location: string;
  highlight?: string;
};

/** Chronological journey: past → present */
export const journey: JourneyItem[] = [
  {
    period: "1999 — 2000",
    role: "Construction Engineer",
    org: "Magyar United Rt.",
    location: "Budapest, Hungary",
  },
  {
    period: "2000 — 2001",
    role: "Logistics Coordinator",
    org: "Mondelēz International",
    location: "Budapest, Hungary",
  },
  {
    period: "2001 — 2004",
    role: "Logistics Manager",
    org: "Mondelēz International",
    location: "Budapest, Hungary",
  },
  {
    period: "2004 — 2006",
    role: "Logistics & Demand Planning Manager",
    org: "Mondelēz International",
    location: "Budapest, Hungary",
  },
  {
    period: "2006 — 2008",
    role: "Warehousing Procurement Manager — EU",
    org: "Mondelēz International",
    location: "Budapest & Bremen",
  },
  {
    period: "2009 — 2010",
    role: "Logistics Manager",
    org: "Roche",
    location: "Budaörs, Hungary",
  },
  {
    period: "2010 — 2011",
    role: "Forward SAP Project — SDL SME",
    org: "Roche",
    location: "Basel area, Switzerland",
  },
  {
    period: "2011 — 2013",
    role: "Demand Planning Manager",
    org: "Roche",
    location: "Basel, Switzerland",
  },
  {
    period: "2013 — 2015",
    role: "Senior Demand Planning Manager",
    org: "Roche",
    location: "Basel, Switzerland",
  },
  {
    period: "2015 — 2017",
    role: "Head of Demand Planning",
    org: "Roche",
    location: "Basel, Switzerland",
  },
  {
    period: "2017 — 2019",
    role: "Head of Integrated Planning",
    org: "Roche",
    location: "Basel, Switzerland",
  },
  {
    period: "2019 — 2021",
    role: "Head of Integrated Planning & Analytics",
    org: "Roche",
    location: "Basel, Switzerland",
  },
  {
    period: "2021 — Present",
    role: "Head of Integrated Insights & Planning",
    org: "Roche",
    location: "Basel, Switzerland",
    highlight: "Analytics and insight supporting global supply chain decisions.",
  },
];

export const portfolioLinks = [
  {
    title: "Case studies",
    description: "Planning transformations, SAP APO, and demand initiatives — narratives in progress.",
  },
  {
    title: "Technical notes",
    description: "ERP vision, data models, and supply chain architecture — reserved for future write-ups.",
  },
  {
    title: "Speaking & media",
    description: "Sessions and panels on integrated planning — placeholder for upcoming content.",
  },
] as const;
