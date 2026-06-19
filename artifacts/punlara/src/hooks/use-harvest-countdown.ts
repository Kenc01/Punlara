export interface HarvestCountdown {
  daysRemaining: number;
  totalCycleDays: number;
  progressPercent: number;
  harvestDate: Date;
  isHarvestSoon: boolean;
  isHarvestVeryClose: boolean;
  isHarvestReady: boolean;
  cycleNumber: number;
  message: string;
}

const HARVEST_CYCLES: Record<string, number> = {
  Mango: 180,
  Mangosteen: 365,
  Lanzones: 270,
  Durian: 365,
  Rambutan: 240,
  Coconut: 365,
  Cacao: 180,
  Banana: 90,
  Jackfruit: 270,
  Avocado: 365,
};

function getCycleDays(species: string): number {
  const key = Object.keys(HARVEST_CYCLES).find(k =>
    species.toLowerCase().includes(k.toLowerCase())
  );
  return key ? HARVEST_CYCLES[key] : 270;
}

export function computeHarvestCountdown(
  adoptedAt: string | Date,
  species: string,
): HarvestCountdown {
  const adoptionDate = new Date(adoptedAt);
  const cycleDays = getCycleDays(species);
  const now = new Date();

  const daysSinceAdoption = Math.floor(
    (now.getTime() - adoptionDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const cycleNumber = Math.floor(daysSinceAdoption / cycleDays) + 1;
  const daysIntoCurrentCycle = daysSinceAdoption % cycleDays;
  const daysRemaining = cycleDays - daysIntoCurrentCycle;
  const progressPercent = Math.round((daysIntoCurrentCycle / cycleDays) * 100);

  const harvestDate = new Date(adoptionDate);
  harvestDate.setDate(harvestDate.getDate() + cycleNumber * cycleDays);

  const isHarvestReady = daysRemaining <= 0;
  const isHarvestVeryClose = daysRemaining <= 7 && daysRemaining > 0;
  const isHarvestSoon = daysRemaining <= 30 && daysRemaining > 7;

  let message = "";
  if (isHarvestReady) {
    message = "🎉 Your harvest is ready! Contact your farmer to arrange delivery.";
  } else if (isHarvestVeryClose) {
    message = `⭐ Almost there! Your ${species} harvest is just ${daysRemaining} days away. Get ready!`;
  } else if (isHarvestSoon) {
    message = `🌟 Your ${species} is ripening! Harvest expected in ${daysRemaining} days.`;
  } else if (daysRemaining <= 90) {
    message = `🌱 Growing well. Harvest in about ${daysRemaining} days — keep an eye on your tree!`;
  } else {
    const months = Math.round(daysRemaining / 30);
    message = `🌿 Your tree is on track. Estimated harvest in ~${months} month${months !== 1 ? "s" : ""}.`;
  }

  return {
    daysRemaining,
    totalCycleDays: cycleDays,
    progressPercent,
    harvestDate,
    isHarvestSoon,
    isHarvestVeryClose,
    isHarvestReady,
    cycleNumber,
    message,
  };
}
