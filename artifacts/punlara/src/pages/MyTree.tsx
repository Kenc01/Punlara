import { useState } from "react";
import { Link } from "wouter";
import { useAuth as useClerkAuth } from "@clerk/react";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { useListMyAdoptions } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import LivingTree from "@/components/LivingTree";
import { useTreeWeather } from "@/hooks/use-weather";
import { computeHarvestCountdown } from "@/hooks/use-harvest-countdown";

export default function MyTree() {
  const { isAuthenticated, login } = useAuth();
  const { getToken } = useClerkAuth();
  const { data: adoptions, isLoading, refetch } = useListMyAdoptions({ query: { enabled: isAuthenticated } });
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);

  const primaryAdoption = adoptions?.[0];
  const { data: weather, isLoading: weatherLoading } = useTreeWeather(
    primaryAdoption?.tree?.id,
    isAuthenticated && !!primaryAdoption
  );

  const harvest = primaryAdoption && primaryAdoption.tree
    ? computeHarvestCountdown(primaryAdoption.createdAt, primaryAdoption.tree.species ?? "Fruit")
    : null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12 flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
          <span className="material-symbols-outlined text-5xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">Log in to see your tree</h2>
          <p className="text-muted-foreground mb-6">Track your farm updates, view your certificates, and see your harvest estimates.</p>
          <button onClick={() => login()} className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-primary/90 transition-colors">
            Log In securely
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
           <Skeleton className="h-10 w-64 mb-8" />
           <Skeleton className="h-[400px] w-full rounded-[24px] mb-8" />
           <div className="grid lg:grid-cols-12 gap-8">
             <div className="lg:col-span-7"><Skeleton className="h-[300px] w-full rounded-[24px]" /></div>
             <div className="lg:col-span-5"><Skeleton className="h-[300px] w-full rounded-[24px]" /></div>
           </div>
        </div>
      </div>
    )
  }

  if (!primaryAdoption) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="w-24 h-24 bg-[#E8F0E9] rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
             <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">You haven't adopted a tree yet</h2>
          <p className="text-muted-foreground mb-8 text-lg">Your stewardship journey starts here. Explore our available trees in Mindanao.</p>
          <Link href="/trees">
            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-colors w-full sm:w-auto">
              Browse Available Trees
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tree = primaryAdoption.tree;

  const handlePayNow = async () => {
    if (!primaryAdoption) return;
    setPaying(true);
    try {
      const token = await getToken();
      await fetch("/api/payments/demo-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ adoptionId: primaryAdoption.id }),
      });
      await refetch();
      toast({ title: "Payment confirmed!", description: "Your tree is now active." });
    } catch {
      toast({ title: "Error", description: "Could not process payment", variant: "destructive" });
    }
    setPaying(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
            Mabuhay, {primaryAdoption.stewardName.split(' ')[0]}! Here's your tree.
          </h1>
        </header>

        {primaryAdoption.status === "pending_payment" && (
          <div className="bg-[#FFF4E5] border border-[#FDE0B2] rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">warning</span>
              <div className="text-secondary-foreground font-medium text-amber-900">Complete your payment to activate your tree and get your certificate.</div>
            </div>
            <button 
              onClick={handlePayNow}
              disabled={paying}
              className="bg-secondary text-white font-bold py-2 px-6 rounded-full hover:bg-secondary/90 transition-colors whitespace-nowrap"
            >
              {paying ? "Processing…" : "Pay Now"}
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">

            {/* === LIVING TREE EXPERIENCE === */}
            <div className="tonal-card p-6 md:p-8 rounded-[24px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-primary">Your Living Tree</h2>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Weather
                </div>
              </div>
              <LivingTree
                weather={weather}
                isLoading={weatherLoading}
                treeName={primaryAdoption.treeName}
                harvestSoon={harvest?.isHarvestSoon}
                harvestVeryClose={harvest?.isHarvestVeryClose}
                harvestReady={harvest?.isHarvestReady}
              />

              {/* Harvest Countdown */}
              {harvest && primaryAdoption.status === "active" && (
                <div className={`rounded-2xl border p-5 ${harvest.isHarvestReady ? "bg-amber-50 border-amber-300" : harvest.isHarvestVeryClose ? "bg-yellow-50 border-yellow-300" : "bg-white border-border"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[20px] ${harvest.isHarvestReady ? "text-amber-600" : "text-primary"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {harvest.isHarvestReady ? "emoji_events" : "calendar_month"}
                      </span>
                      <h3 className={`font-serif font-bold ${harvest.isHarvestReady ? "text-amber-800" : "text-primary"}`}>
                        {harvest.isHarvestReady ? "Harvest Ready!" : "Harvest Countdown"}
                      </h3>
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${harvest.isHarvestReady ? "bg-amber-400 text-white" : harvest.isHarvestVeryClose ? "bg-yellow-400 text-white" : harvest.isHarvestSoon ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {harvest.isHarvestReady ? "Ready Now" : `${harvest.daysRemaining} days`}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${harvest.isHarvestReady ? "bg-amber-400" : harvest.isHarvestVeryClose ? "bg-yellow-400" : "progress-gradient"}`}
                      style={{ width: `${harvest.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground mb-3">
                    <span>Cycle start</span>
                    <span className="font-semibold text-primary">{harvest.progressPercent}% complete</span>
                    <span>Est. harvest: {harvest.harvestDate.toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                  </div>

                  <p className={`text-sm leading-relaxed ${harvest.isHarvestReady ? "text-amber-800 font-semibold" : "text-muted-foreground"}`}>
                    {harvest.message}
                  </p>
                </div>
              )}
            </div>

            {/* Growth Timeline */}
            <div className="tonal-card p-6 md:p-8 rounded-[24px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-2xl font-bold text-primary">Growth Timeline</h2>
              </div>

              <div className="relative mb-12 mt-6">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${primaryAdoption.status === 'active' ? 'progress-gradient w-[35%]' : 'bg-muted w-0'} rounded-full transition-all duration-1000`}></div>
                </div>
                
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm z-10 flex items-center justify-center">
                       <span className="material-symbols-outlined text-[12px] text-white">check</span>
                    </div>
                    <span className="text-xs font-bold text-primary">Adopted</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center -mt-1 ${primaryAdoption.status === 'active' ? 'bg-secondary' : 'bg-muted'}`}>
                      {primaryAdoption.status === 'active' && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                    </div>
                    <span className={`text-sm font-bold ${primaryAdoption.status === 'active' ? 'text-secondary' : 'text-muted-foreground'}`}>Growing</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted border-4 border-white shadow-sm z-10"></div>
                    <span className="text-xs font-bold text-muted-foreground">Fruiting</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted border-4 border-white shadow-sm z-10"></div>
                    <span className="text-xs font-bold text-muted-foreground">Harvest</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFCFA] p-4 rounded-xl border border-border">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Tree Code</div>
                  <div className="font-mono text-lg font-bold text-primary">{tree?.treeCode}</div>
                </div>
                <div className="bg-[#FAFCFA] p-4 rounded-xl border border-border">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Est. Harvest</div>
                  <div className="font-serif text-2xl font-bold text-primary">{tree?.estimatedHarvestKg} <span className="text-lg text-muted-foreground font-sans font-medium">kg/yr</span></div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">

            {/* Tree snapshot */}
            <div className="w-full rounded-[24px] overflow-hidden relative shadow-xl group" style={{ aspectRatio: '16/10' }}>
              <img 
                src={tree?.imageUrl || "/hero-orchard.png"} 
                alt={tree?.species} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${primaryAdoption.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                <span className="text-xs font-bold text-primary">{primaryAdoption.status === 'active' ? 'Growing Strong' : 'Pending Activation'}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 wooden-sign p-4 rounded-xl transform -rotate-1">
                <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Estate Registered</div>
                <h2 className="font-serif text-xl font-bold text-white mb-2">{primaryAdoption.treeName}</h2>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-xs font-semibold text-white border border-white/10">{tree?.species}</span>
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-sm text-xs font-semibold text-white border border-white/10">{tree?.location}</span>
                </div>
              </div>
            </div>

            {/* Current weather snapshot */}
            {weather && (
              <div className="bg-white rounded-[24px] border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
                  <h3 className="font-serif font-bold text-primary">Farm Weather Now</h3>
                </div>
                <div className="text-sm text-muted-foreground mb-4">{weather.description} · {weather.location}</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "thermometer", label: "Temperature", value: `${weather.temperature}°C` },
                    { icon: "water_drop", label: "Humidity", value: `${weather.humidity}%` },
                    { icon: "grain", label: "Rainfall", value: `${weather.rain}mm` },
                    { icon: "air", label: "Wind", value: `${weather.windspeed}km/h` },
                  ].map(stat => (
                    <div key={stat.label} className="bg-muted/30 rounded-xl p-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">{stat.icon}</span>
                      <div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                        <div className="font-bold text-primary text-sm">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Meet Your Farmer */}
            {tree?.farmerId && (
              <Link href={`/farm/${tree.farmerId}`}>
                <div className="bg-white rounded-[24px] border border-border p-5 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-[#E8F0E9] flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Tending Your Tree</div>
                    <div className="font-serif font-bold text-primary truncate">Meet Your Farmer</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {tree.location}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              </Link>
            )}

            {/* Forest Guardian Impact */}
            <div className="tonal-card rounded-[24px] p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">local_police</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-primary">Forest Guardian</h3>
                  <div className="text-xs font-semibold text-secondary">{tree?.tier} Tier Impact</div>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#E8F0E9] text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">co2</span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">Carbon Sequestration</div>
                    <div className="text-muted-foreground text-sm">{tree?.co2PerYear || 100}kg CO2 offset this year</div>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">Ecosystem Service</div>
                    <div className="text-muted-foreground text-sm">Contributes to groundwater retention</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">Community Support</div>
                    <div className="text-muted-foreground text-sm">Supports fair-wage farming jobs in {tree?.location}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      <MobileNav />
    </div>
  );
}
