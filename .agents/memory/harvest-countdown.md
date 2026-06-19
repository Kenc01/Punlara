---
name: Harvest Countdown
description: Harvest countdown feature for Punlara's My Tree page — golden glow + countdown card.
---

## Implementation

- Hook: `artifacts/punlara/src/hooks/use-harvest-countdown.ts` — exports `computeHarvestCountdown(createdAt, species)`.
- Returns: `daysRemaining`, `progressPercent`, `harvestDate`, `message`, `isHarvestSoon`, `isHarvestVeryClose`, `isHarvestReady`.
- Species cycle lengths: Mango=180d, Mangosteen=365d, etc. (defaults in hook).
- Wired into `MyTree.tsx`: computes from `primaryAdoption.createdAt` + `primaryAdoption.tree.species`.
- `LivingTree.tsx` accepts `harvestSoon`, `harvestVeryClose`, `harvestReady` boolean props → triggers golden sky gradient and `GoldenHarvestGlow` overlay.
- Countdown UI card in MyTree: progress bar, days remaining badge, estimated harvest date, status message.
