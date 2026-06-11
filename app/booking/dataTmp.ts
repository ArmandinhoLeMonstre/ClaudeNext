export const SERVICES = [
  {
    group: "CHEVEUX",
    items: [
      { id: "coupe", name: "Coupe", duration: 30, price: 40 },
      { id: "coupe-transfo", name: "Coupe transformation", duration: 60, price: 55 },
      { id: "decoloration", name: "Décoloration", duration: null, price: null },
      { id: "shampoing", name: "Shampoing & soin spécifique", duration: 15, price: 10 },
    ],
  },
  {
    group: "BARBE",
    items: [
      { id: "sculpture-rasage", name: "Sculpture de barbe + rasage", duration: 30, price: 35 },
      { id: "rasage-trad", name: "Rasage traditionnel", duration: 30, price: 25 },
      { id: "sculpture", name: "Sculpture de barbe", duration: 30, price: 25 },
      { id: "coloration-barbe", name: "Coloration de barbe", duration: 30, price: 20 },
    ],
  },
  {
    group: "COMBINÉ",
    items: [
      { id: "coupe-taille", name: "Coupe + taille de barbe", duration: 45, price: 55 },
      { id: "coupe-taille-rasage", name: "Coupe + taille de barbe + rasage & serviette chaude", duration: 60, price: 65 },
    ],
  },
];

export const BARBERS = [
  { id: "tyler", name: "TYLER", role: "FONDATEUR · MAÎTRE BARBIER", handle: "@tyler.brussels" },
  { id: "nabil", name: "NABIL", role: "BARBIER · COLORISTE", handle: "@nabil.cuts" },
];