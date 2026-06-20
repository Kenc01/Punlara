import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Farmer {
  id: number;
  userId: string;
  farmName: string;
  farmerName: string;
  location: string;
  bio: string | null;
  imageUrl: string | null;
  phone: string | null;
  treeCount: number;
  status: string;
  commissionRate: string;
  lat: string | null;
  lng: string | null;
  createdAt: string;
}

export interface FarmerWithTrees extends Farmer {
  trees: Array<{
    id: number;
    name: string;
    species: string;
    tier: string;
    pricePerYear: number;
    location: string;
    estimatedHarvestKg: number;
    imageUrl: string;
    status: string;
    treeCode: string;
  }>;
}

async function fetchFarmers(): Promise<Farmer[]> {
  const res = await fetch("/api/farmers");
  if (!res.ok) throw new Error("Failed to fetch farmers");
  return res.json();
}

async function fetchFarmer(id: number): Promise<FarmerWithTrees> {
  const res = await fetch(`/api/farmers/${id}`);
  if (!res.ok) throw new Error("Farmer not found");
  return res.json();
}

async function fetchMyFarm(): Promise<FarmerWithTrees> {
  const res = await fetch("/api/farmers/my-farm");
  if (!res.ok) throw new Error("No farm found");
  return res.json();
}

async function registerFarm(data: {
  farmName: string;
  farmerName: string;
  location: string;
  bio: string;
  phone: string;
  treeCount: number;
  imageUrl?: string;
}): Promise<Farmer> {
  const res = await fetch("/api/farmers/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }
  return res.json();
}

export function useFarmers() {
  return useQuery({ queryKey: ["farmers"], queryFn: fetchFarmers });
}

export function useFarmer(id: number | undefined) {
  return useQuery({
    queryKey: ["farmer", id],
    queryFn: () => fetchFarmer(id!),
    enabled: id != null,
  });
}

export function useMyFarm(enabled = true) {
  return useQuery({
    queryKey: ["my-farm"],
    queryFn: fetchMyFarm,
    enabled,
    retry: false,
  });
}

export function useRegisterFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-farm"] });
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
    },
  });
}
