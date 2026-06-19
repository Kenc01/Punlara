import { useQuery } from "@tanstack/react-query";

export type WeatherCondition = "sunny" | "partly_cloudy" | "cloudy" | "light_rain" | "rainy" | "stormy" | "thirsty";
export type TreeMood = "happy" | "content" | "hydrated" | "thirsty" | "sheltered";

export interface TreeWeather {
  condition: WeatherCondition;
  mood: TreeMood;
  description: string;
  treeMessage: string;
  temperature: number;
  humidity: number;
  rain: number;
  windspeed: number;
  location: string;
}

async function fetchTreeWeather(treeId: number): Promise<TreeWeather> {
  const res = await fetch(`/api/trees/${treeId}/weather`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export function useTreeWeather(treeId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: ["tree-weather", treeId],
    queryFn: () => fetchTreeWeather(treeId!),
    enabled: enabled && treeId != null,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}
