import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { treesTable } from "../../lib/db/src/schema/trees";

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL!;
const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NEON_DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});
const db = drizzle(pool);

const trees = [
  {
    treeCode: "MNG-001",
    name: "Carabao Mango",
    species: "Mangifera indica 'Carabao'",
    tier: "Premium",
    pricePerYear: 4500,
    location: "Guimaras, Mindanao",
    estimatedHarvestKg: 80,
    imageUrl: "https://images.unsplash.com/photo-1601493700631-2851c9994003?w=800",
    status: "available",
    description: "The world-famous Philippine mango, prized for its sweet, fiberless flesh. Your tree produces up to 80kg of export-quality fruit per season.",
    co2PerYear: 22,
  },
  {
    treeCode: "DUR-001",
    name: "Puyat Durian",
    species: "Durio zibethinus 'Puyat'",
    tier: "Premium",
    pricePerYear: 4500,
    location: "Davao del Sur, Mindanao",
    estimatedHarvestKg: 50,
    imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=800",
    status: "available",
    description: "The king of fruits from Davao. Rich, creamy, and intensely flavored. Puyat is the most sought-after variety for its thick flesh and small seeds.",
    co2PerYear: 28,
  },
  {
    treeCode: "CAL-001",
    name: "Calamansi",
    species: "Citrus microcarpa",
    tier: "Seedling",
    pricePerYear: 1500,
    location: "Bukidnon, Mindanao",
    estimatedHarvestKg: 30,
    imageUrl: "https://images.unsplash.com/photo-1582979512210-1a2c42ab0a87?w=800",
    status: "available",
    description: "The Filipino lime — a kitchen staple and wellness favourite. Perfect for marinades, juices, and vitamin C. A great starter tree adoption.",
    co2PerYear: 10,
  },
  {
    treeCode: "POM-001",
    name: "Raintree Pomelo",
    species: "Citrus maxima",
    tier: "Classic",
    pricePerYear: 2500,
    location: "Cotabato, Mindanao",
    estimatedHarvestKg: 40,
    imageUrl: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800",
    status: "available",
    description: "Mindanao's giant citrus — each fruit can weigh over a kilo. Sweet, refreshing, and low-acid. Harvested around Chinese New Year, making it a popular gift.",
    co2PerYear: 18,
  },
  {
    treeCode: "MAN-001",
    name: "Mangosteen",
    species: "Garcinia mangostana",
    tier: "Premium",
    pricePerYear: 4500,
    location: "Davao Oriental, Mindanao",
    estimatedHarvestKg: 25,
    imageUrl: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800",
    status: "available",
    description: "The queen of fruits, revered across Asia. Delicate white segments with a sweet-tart flavour inside a deep purple shell. Slow-growing and rare.",
    co2PerYear: 15,
  },
  {
    treeCode: "RAM-001",
    name: "Red Rambutan",
    species: "Nephelium lappaceum",
    tier: "Classic",
    pricePerYear: 2500,
    location: "Zamboanga, Mindanao",
    estimatedHarvestKg: 60,
    imageUrl: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800",
    status: "available",
    description: "Vibrant red spiky clusters that are as fun to eat as they are beautiful. Juicy, translucent flesh with a lychee-like sweetness.",
    co2PerYear: 20,
  },
  {
    treeCode: "LAN-001",
    name: "Camiguin Lanzones",
    species: "Lansium parasiticum",
    tier: "Classic",
    pricePerYear: 2500,
    location: "Camiguin, Mindanao",
    estimatedHarvestKg: 45,
    imageUrl: "https://images.unsplash.com/photo-1617814647370-bb98de97d22c?w=800",
    status: "available",
    description: "Famous throughout the Philippines, Camiguin lanzones are celebrated at a dedicated annual festival. Sweeter and less bitter than other varieties.",
    co2PerYear: 16,
  },
  {
    treeCode: "NAR-001",
    name: "Heritage Narra",
    species: "Pterocarpus indicus",
    tier: "Premium",
    pricePerYear: 4500,
    location: "Bukidnon, Mindanao",
    estimatedHarvestKg: 0,
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    status: "available",
    description: "Adopt the national tree of the Philippines. While not a fruit tree, your Narra sequesters over 35kg of CO₂ per year and contributes to reforestation of native forest.",
    co2PerYear: 35,
  },
];

async function seed() {
  console.log("Seeding trees into Neon database...");
  await db.insert(treesTable).values(trees).onConflictDoNothing();
  console.log(`✓ Seeded ${trees.length} trees`);
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
