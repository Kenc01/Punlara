import { Link, useParams } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { useFarmer } from "@/hooks/use-farmers";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmerProfile() {
  const { id } = useParams<{ id: string }>();
  const farmerId = parseInt(id, 10);
  const { data: farmer, isLoading, isError } = useFarmer(isNaN(farmerId) ? undefined : farmerId);
  const { isAuthenticated, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-24">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-56 w-full rounded-[24px] mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-48 rounded-[20px]" />
            <div className="lg:col-span-2 space-y-4">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (isError || !farmer) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-24 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-muted mb-4">nature_people</span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">Farm not found</h2>
          <p className="text-muted-foreground mb-6">This farm profile isn't available or may have been removed.</p>
          <Link href="/trees"><button className="bg-primary text-white px-6 py-2 rounded-full font-semibold">Browse All Trees</button></Link>
        </div>
        <MobileNav />
      </div>
    );
  }

  const availableTrees = farmer.trees?.filter(t => t.status === "available") ?? [];
  const adoptedTrees = farmer.trees?.filter(t => t.status === "adopted") ?? [];
  const adoptionRate = farmer.trees?.length ? Math.round((adoptedTrees.length / farmer.trees.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-12">
      <Navbar />

      {/* Farm hero */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden">
        {farmer.imageUrl ? (
          <img src={farmer.imageUrl} alt={farmer.farmName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-8xl opacity-30" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="inline-flex items-center gap-1.5 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Verified Punlara Partner
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{farmer.farmName}</h1>
          <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {farmer.location}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Farmer info */}
            <div className="bg-white rounded-[20px] border border-border p-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-[#E8F0E9] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <div>
                  <div className="font-bold text-primary">{farmer.farmerName}</div>
                  <div className="text-xs text-muted-foreground">Farm Owner</div>
                </div>
              </div>
              {farmer.bio && <p className="text-sm text-muted-foreground leading-relaxed">{farmer.bio}</p>}
            </div>

            {/* Farm stats */}
            <div className="bg-white rounded-[20px] border border-border p-6 space-y-4">
              <h3 className="font-serif font-bold text-primary">Farm Stats</h3>
              {[
                { icon: "park", label: "Total Trees Listed", value: farmer.trees?.length ?? farmer.treeCount },
                { icon: "check_circle", label: "Currently Adopted", value: adoptedTrees.length },
                { icon: "favorite", label: "Adoption Rate", value: `${adoptionRate}%` },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                    {stat.label}
                  </div>
                  <span className="font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Farmer commitment */}
            <div className="bg-[#E8F0E9] rounded-[20px] p-6">
              <h3 className="font-serif font-bold text-primary mb-3">Our Commitment</h3>
              <div className="space-y-2">
                {[
                  "Monthly photo updates per tree",
                  "Seasonal harvest delivery",
                  "QR code tag on your tree",
                  "Personal farmer notes in every box",
                ].map(c => (
                  <div key={c} className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Map */}
          {(farmer.lat && farmer.lng) && (
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[20px] border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-6 pt-5 pb-3">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <h3 className="font-serif font-bold text-primary">Farm Location</h3>
                  <span className="ml-auto text-xs text-muted-foreground">{farmer.location}</span>
                </div>
                <iframe
                  title="Farm location map"
                  className="w-full"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(farmer.lng) - 0.04},${parseFloat(farmer.lat) - 0.04},${parseFloat(farmer.lng) + 0.04},${parseFloat(farmer.lat) + 0.04}&layer=mapnik&marker=${farmer.lat},${farmer.lng}`}
                />
                <div className="px-6 py-3 bg-muted/30 text-xs text-muted-foreground flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Zamboanga Peninsula, Mindanao · <a href={`https://www.openstreetmap.org/?mlat=${farmer.lat}&mlon=${farmer.lng}#map=14/${farmer.lat}/${farmer.lng}`} target="_blank" rel="noreferrer" className="underline hover:text-primary transition-colors">Open in maps</a>
                </div>
              </div>
            </div>
          )}

          {/* Tree listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Available Trees from {farmer.farmName}
              </h2>
              <span className="bg-[#E8F0E9] text-primary text-sm font-bold px-3 py-1 rounded-full">
                {availableTrees.length} available
              </span>
            </div>

            {availableTrees.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {availableTrees.map(tree => (
                  <div key={tree.id} className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="relative aspect-video">
                      <img src={tree.imageUrl || "/hero-orchard.png"} alt={tree.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {tree.tier}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-primary mb-1">{tree.name}</h3>
                      <div className="text-xs text-muted-foreground mb-3">{tree.species}</div>
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-muted-foreground">Adoption</span>
                        <span className="font-bold text-primary">₱{tree.pricePerYear.toLocaleString()}/yr</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="text-muted-foreground">Est. Harvest</span>
                        <span className="font-semibold">{tree.estimatedHarvestKg}kg</span>
                      </div>
                      <Link href={`/adopt?treeId=${tree.id}`}>
                        <button
                          onClick={() => { if (!isAuthenticated) { login(); } }}
                          className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-full text-sm font-semibold transition-colors"
                        >
                          Adopt This Tree
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-border">
                <span className="material-symbols-outlined text-4xl text-muted mb-3">park</span>
                <p className="text-muted-foreground">No trees available from this farm right now.</p>
                <Link href="/trees">
                  <button className="mt-4 text-primary text-sm font-semibold hover:underline">Browse all trees →</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
