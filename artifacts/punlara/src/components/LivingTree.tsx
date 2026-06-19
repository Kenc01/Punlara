import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WeatherCondition, TreeMood, TreeWeather } from "@/hooks/use-weather";

interface LivingTreeProps {
  weather: TreeWeather | undefined;
  isLoading?: boolean;
  treeName?: string;
  harvestSoon?: boolean;
  harvestVeryClose?: boolean;
  harvestReady?: boolean;
}

const SKY_GRADIENTS: Record<TreeMood, string> = {
  happy: "from-sky-400 via-sky-300 to-emerald-100",
  hydrated: "from-slate-600 via-slate-500 to-slate-400",
  thirsty: "from-amber-500 via-amber-300 to-yellow-100",
  content: "from-sky-300 via-blue-200 to-slate-100",
  sheltered: "from-slate-800 via-slate-700 to-slate-600",
};

const FOLIAGE: Record<TreeMood, { main: string; light: string; dark: string }> = {
  happy: { main: "#2E7D32", light: "#43A047", dark: "#1B5E20" },
  hydrated: { main: "#1B5E20", light: "#2E7D32", dark: "#0A3D0A" },
  thirsty: { main: "#9E9D24", light: "#C0CA33", dark: "#827717" },
  content: { main: "#388E3C", light: "#4CAF50", dark: "#2E7D32" },
  sheltered: { main: "#33691E", light: "#558B2F", dark: "#1B5E20" },
};

const MOOD_LABELS: Record<TreeMood, string> = {
  happy: "Happy & Thriving",
  hydrated: "Lush & Hydrated",
  thirsty: "Needs Water",
  content: "Content & Growing",
  sheltered: "Sheltered from Storm",
};

const MOOD_ICONS: Record<TreeMood, string> = {
  happy: "sentiment_very_satisfied",
  hydrated: "water_drop",
  thirsty: "local_fire_department",
  content: "sentiment_satisfied",
  sheltered: "shield",
};

function RainDrops({ intensity = "medium" }: { intensity?: "light" | "medium" | "heavy" }) {
  const count = intensity === "light" ? 12 : intensity === "heavy" ? 30 : 20;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] rounded-full bg-blue-300/70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            height: intensity === "light" ? "12px" : intensity === "heavy" ? "22px" : "16px",
            animationName: "rainfall",
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        />
      ))}
    </div>
  );
}

function SunRays() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden">
      <div
        className="absolute top-4 right-6 w-20 h-20 rounded-full bg-yellow-300/30"
        style={{ animationName: "sunPulse", animationDuration: "3s", animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" }}
      />
      <div className="absolute top-8 right-10 w-12 h-12 rounded-full bg-yellow-200/50" style={{ animationName: "sunPulse", animationDuration: "3s", animationDelay: "0.5s", animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" }} />
    </div>
  );
}

function StormOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/20" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-yellow-300 text-2xl font-bold"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 5}%`,
            animationName: "lightning",
            animationDuration: "4s",
            animationDelay: `${i * 1.3}s`,
            animationIterationCount: "infinite",
          }}
        >⚡</div>
      ))}
      <RainDrops intensity="heavy" />
    </div>
  );
}

function HarvestSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-yellow-400 text-sm"
          style={{
            left: `${15 + (i * 70 / 8)}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationName: "sparkle",
            animationDuration: `${1.5 + i * 0.3}s`,
            animationDelay: `${i * 0.2}s`,
            animationIterationCount: "infinite",
          }}
        >✨</div>
      ))}
    </div>
  );
}

function GoldenHarvestGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 55%, rgba(255,215,0,0.25) 0%, transparent 70%)",
          animationName: "sunPulse",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-in-out",
        }}
      />
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${10 + (i * 75 / 12)}%`,
            top: `${15 + (i % 4) * 18}%`,
            fontSize: i % 3 === 0 ? "18px" : "13px",
            animationName: "sparkle",
            animationDuration: `${1.2 + (i * 0.25)}s`,
            animationDelay: `${i * 0.15}s`,
            animationIterationCount: "infinite",
          }}
        >
          {i % 4 === 0 ? "✨" : i % 4 === 1 ? "⭐" : i % 4 === 2 ? "🌟" : "✨"}
        </div>
      ))}
    </div>
  );
}

function TreeSVG({ mood, condition, harvestOverride }: { mood: TreeMood; condition: WeatherCondition; harvestOverride?: "soon" | "very_close" | "ready" }) {
  const effectiveMood = harvestOverride ? "happy" : mood;
  const colors = harvestOverride
    ? { main: harvestOverride === "ready" ? "#F9A825" : "#43A047", light: harvestOverride === "ready" ? "#FFD54F" : "#66BB6A", dark: harvestOverride === "ready" ? "#F57F17" : "#2E7D32" }
    : FOLIAGE[effectiveMood];
  const showFruits = harvestOverride || (condition === "sunny" && mood === "happy");
  const isStormy = mood === "sheltered" && !harvestOverride;
  const sway = isStormy ? [0, -3, 3, -3, 0] : harvestOverride === "very_close" || harvestOverride === "ready" ? [0, 1, -1, 1, 0] : [0, 0];

  return (
    <motion.div
      className="flex items-end justify-center w-full h-full"
      animate={{ rotate: sway }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "bottom center" }}
    >
      <svg viewBox="0 0 280 320" width="100%" height="100%" style={{ maxHeight: 280 }}>
        {/* Ground shadow */}
        <ellipse cx="140" cy="310" rx="80" ry="12" fill="rgba(0,0,0,0.15)" />
        
        {/* Trunk */}
        <rect x="122" y="220" width="36" height="90" rx="10" fill="#5D4037" />
        <rect x="128" y="225" width="6" height="80" rx="3" fill="#4E342E" opacity="0.5" />
        <rect x="145" y="230" width="5" height="75" rx="3" fill="#795548" opacity="0.4" />
        
        {/* Left branch */}
        <path d="M135,240 Q108,218 88,195" stroke="#5D4037" strokeWidth="14" fill="none" strokeLinecap="round" />
        {/* Right branch */}
        <path d="M145,232 Q170,210 190,188" stroke="#5D4037" strokeWidth="14" fill="none" strokeLinecap="round" />

        {/* Canopy - back/bottom layer for depth */}
        <circle cx="140" cy="175" r="85" fill={colors.dark} opacity="0.6" />
        
        {/* Left cluster */}
        <circle cx="88" cy="185" r="58" fill={colors.main} />
        {/* Right cluster */}
        <circle cx="192" cy="178" r="56" fill={colors.main} />
        {/* Top center */}
        <circle cx="140" cy="115" r="70" fill={colors.main} />
        {/* Front center */}
        <circle cx="140" cy="190" r="62" fill={colors.main} />
        
        {/* Highlights - lighter patches for 3D depth */}
        <circle cx="118" cy="110" r="35" fill={colors.light} opacity="0.6" />
        <circle cx="162" cy="118" r="28" fill={colors.light} opacity="0.45" />
        <circle cx="80" cy="170" r="22" fill={colors.light} opacity="0.5" />
        
        {/* Fruits for harvest/happy mode */}
        {showFruits && [
          { cx: 115, cy: 145, r: 7, fill: "#FF6B35" },
          { cx: 158, cy: 138, r: 8, fill: "#FFB300" },
          { cx: 100, cy: 175, r: 6, fill: "#E91E63" },
          { cx: 175, cy: 162, r: 7, fill: "#FF6B35" },
          { cx: 140, cy: 155, r: 8, fill: "#FF8F00" },
          { cx: 125, cy: 200, r: 6, fill: "#FFB300" },
        ].map((fruit, i) => (
          <motion.circle
            key={i}
            cx={fruit.cx}
            cy={fruit.cy}
            r={fruit.r}
            fill={fruit.fill}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

        {/* Drooping leaves for thirsty */}
        {mood === "thirsty" && [
          { x: 95, y: 200, w: 25, h: 14 },
          { x: 155, y: 210, w: 22, h: 12 },
          { x: 118, y: 215, w: 20, h: 11 },
        ].map((leaf, i) => (
          <motion.ellipse
            key={i}
            cx={leaf.x}
            cy={leaf.y}
            rx={leaf.w / 2}
            ry={leaf.h / 2}
            fill={colors.light}
            opacity={0.7}
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export default function LivingTree({ weather, isLoading, treeName, harvestSoon, harvestVeryClose, harvestReady }: LivingTreeProps) {
  const mood: TreeMood = weather?.mood ?? "content";
  const condition: WeatherCondition = weather?.condition ?? "partly_cloudy";

  const harvestOverride: "soon" | "very_close" | "ready" | undefined =
    harvestReady ? "ready" : harvestVeryClose ? "very_close" : harvestSoon ? "soon" : undefined;

  const skyClass = harvestReady
    ? "from-amber-500 via-yellow-400 to-amber-200"
    : harvestVeryClose
    ? "from-amber-400 via-yellow-300 to-emerald-100"
    : harvestSoon
    ? "from-sky-400 via-emerald-300 to-yellow-100"
    : SKY_GRADIENTS[mood];

  const moodLabel = harvestReady
    ? "Harvest Ready! 🎉"
    : harvestVeryClose
    ? "Almost Harvest Time!"
    : harvestSoon
    ? "Harvest Coming Soon"
    : MOOD_LABELS[mood];

  const moodIcon = harvestOverride ? "emoji_events" : MOOD_ICONS[mood];

  return (
    <div className="w-full space-y-4">
      {/* Animated tree card */}
      <div className={`relative w-full rounded-[24px] overflow-hidden bg-gradient-to-b ${skyClass} min-h-[320px] flex flex-col`}>
        
        {/* CSS animations injected inline */}
        <style>{`
          @keyframes rainfall {
            0% { transform: translateY(-20px); opacity: 0; }
            30% { opacity: 0.8; }
            100% { transform: translateY(360px); opacity: 0; }
          }
          @keyframes sunPulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.15); }
          }
          @keyframes lightning {
            0%, 90%, 100% { opacity: 0; }
            92%, 94% { opacity: 1; }
            93%, 95% { opacity: 0.2; }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
          }
        `}</style>

        {/* Harvest overlays take priority over weather overlays */}
        {harvestOverride ? (
          <GoldenHarvestGlow />
        ) : (
          <>
            {(condition === "rainy" || condition === "light_rain") && (
              <RainDrops intensity={condition === "rainy" ? "heavy" : "light"} />
            )}
            {condition === "sunny" && <SunRays />}
            {condition === "stormy" && <StormOverlay />}
            {mood === "happy" && condition === "sunny" && <HarvestSparkles />}
          </>
        )}

        {/* Tree name tag */}
        {treeName && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-xs font-bold text-primary">{treeName}</span>
          </div>
        )}

        {/* Mood / harvest badge */}
        <div className={`absolute top-4 right-4 flex items-center gap-1.5 backdrop-blur px-3 py-1.5 rounded-full shadow-sm ${harvestOverride ? "bg-amber-400 text-white" : "bg-white/90"}`}>
          <span className={`material-symbols-outlined text-[14px] ${harvestOverride ? "text-white" : "text-primary"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {moodIcon}
          </span>
          <span className={`text-xs font-bold ${harvestOverride ? "text-white" : "text-primary"}`}>{moodLabel}</span>
        </div>

        {/* Tree SVG */}
        <motion.div
          key={`${mood}-${harvestOverride}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex items-end justify-center px-4 pt-12 pb-2"
          style={{ minHeight: 260 }}
        >
          <TreeSVG mood={mood} condition={condition} harvestOverride={harvestOverride} />
        </motion.div>

        {/* Weather stats bar */}
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex items-center justify-around">
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px]">thermometer</span>
            <span className="text-sm font-bold">{weather?.temperature ?? "—"}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px]">water_drop</span>
            <span className="text-sm font-bold">{weather?.humidity ?? "—"}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px]">grain</span>
            <span className="text-sm font-bold">{weather?.rain ?? 0}mm</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[16px]">air</span>
            <span className="text-sm font-bold">{weather?.windspeed ?? "—"}km/h</span>
          </div>
        </div>
      </div>

      {/* Status message */}
      <AnimatePresence mode="wait">
        {weather && (
          <motion.div
            key={weather.condition}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-border rounded-2xl p-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8F0E9] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                notifications
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Live Farm Update · {weather.location}</div>
              <p className="text-sm text-foreground leading-relaxed">{weather.treeMessage}</p>
            </div>
          </motion.div>
        )}
        {isLoading && (
          <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
