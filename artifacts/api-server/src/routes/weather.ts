import { Router } from "express";
import { db } from "../lib/db";
import { treesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const LOCATION_COORDS: Record<string, { lat: number; lon: number }> = {
  zamboanga: { lat: 6.9214, lon: 122.079 },
  davao: { lat: 7.1907, lon: 125.4553 },
  bukidnon: { lat: 8.0515, lon: 124.6275 },
  cotabato: { lat: 7.2048, lon: 124.2311 },
  camiguin: { lat: 9.178, lon: 124.7213 },
  guimaras: { lat: 10.5938, lon: 122.6331 },
  "davao oriental": { lat: 6.9422, lon: 126.175 },
  "davao del sur": { lat: 6.7638, lon: 125.3259 },
  mindanao: { lat: 7.5, lon: 124.5 },
};

function getCoords(location: string): { lat: number; lon: number } {
  const loc = location.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (loc.includes(key)) return coords;
  }
  return { lat: 7.5, lon: 124.5 };
}

type WeatherCondition = "sunny" | "partly_cloudy" | "cloudy" | "light_rain" | "rainy" | "stormy" | "thirsty";
type TreeMood = "happy" | "content" | "hydrated" | "thirsty" | "sheltered";

function interpretWeather(
  code: number,
  rain: number,
  humidity: number,
): { condition: WeatherCondition; mood: TreeMood; description: string; treeMessage: string } {
  let condition: WeatherCondition;
  let mood: TreeMood;
  let description: string;
  let treeMessage: string;

  if (code >= 95) {
    condition = "stormy";
    mood = "sheltered";
    description = "Thunderstorm";
    treeMessage = "⚡ There's a storm in Mindanao. Our farmers are keeping your tree safe and sheltered.";
  } else if (code >= 80 || (code >= 61 && code <= 67) || rain > 0.5) {
    condition = "rainy";
    mood = "hydrated";
    description = "Rainy";
    treeMessage = `🌧️ It's raining on the farm right now! Your tree is getting a wonderful drink today in ${humidity > 80 ? "heavy" : "steady"} rainfall.`;
  } else if (code >= 51 && code <= 57) {
    condition = "light_rain";
    mood = "hydrated";
    description = "Light Drizzle";
    treeMessage = "🌦️ A gentle drizzle is falling on your tree. It's lush and very happy right now.";
  } else if (code >= 45 && code <= 48) {
    condition = "cloudy";
    mood = "content";
    description = "Foggy";
    treeMessage = "🌫️ Misty morning on the farm. Your tree is resting quietly in the cool highland air.";
  } else if (code === 3) {
    condition = "cloudy";
    mood = "content";
    description = "Overcast";
    treeMessage = "☁️ Cloudy skies over the farm today. Your tree is staying cool and comfortable.";
  } else if (code === 1 || code === 2) {
    condition = humidity < 55 ? "thirsty" : "partly_cloudy";
    mood = humidity < 55 ? "thirsty" : "content";
    description = "Partly Cloudy";
    treeMessage =
      humidity < 55
        ? "😮‍💨 It's been a bit dry lately. Our farmers are making sure your tree stays well-hydrated."
        : "⛅ Partly cloudy and mild on the farm. Your tree is growing at a steady pace.";
  } else {
    if (humidity < 50) {
      condition = "thirsty";
      mood = "thirsty";
      description = "Sunny & Dry";
      treeMessage = "☀️ Hot and dry on the farm today. Our team is watering your tree to keep it healthy.";
    } else {
      condition = "sunny";
      mood = "happy";
      description = "Sunny";
      treeMessage = "☀️ Beautiful sunshine in Mindanao! Your tree is glowing with health and soaking up the tropical sun.";
    }
  }

  return { condition, mood, description, treeMessage };
}

router.get("/trees/:id/weather", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid tree ID" });
      return;
    }

    const [tree] = await db.select().from(treesTable).where(eq(treesTable.id, id));
    if (!tree) {
      res.status(404).json({ error: "Tree not found" });
      return;
    }

    const coords = getCoords(tree.location);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,rain,weathercode,windspeed_10m&timezone=Asia/Manila`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather API unavailable");
    }

    const data = (await response.json()) as {
      current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        rain: number;
        weathercode: number;
        windspeed_10m: number;
      };
    };

    const current = data.current;
    const { condition, mood, description, treeMessage } = interpretWeather(
      current.weathercode,
      current.rain,
      current.relative_humidity_2m,
    );

    res.json({
      condition,
      mood,
      description,
      treeMessage,
      temperature: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      rain: current.rain,
      windspeed: Math.round(current.windspeed_10m),
      location: tree.location,
    });
  } catch (err) {
    req.log.error(err);
    res.status(200).json({
      condition: "sunny",
      mood: "happy",
      description: "Sunny",
      treeMessage: "☀️ Beautiful sunshine in Mindanao today! Your tree is thriving.",
      temperature: 29,
      humidity: 72,
      rain: 0,
      windspeed: 8,
      location: "Mindanao",
    });
  }
});

export default router;
