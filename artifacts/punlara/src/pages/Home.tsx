import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { useListTrees } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: trees, isLoading } = useListTrees();
  const featuredTrees = trees?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16 md:pb-0">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 min-h-[870px] grid md:grid-cols-2 gap-12 items-center py-12 md:py-24">
        <div className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 bg-[#E8F0E9] text-primary px-4 py-2 rounded-full text-sm font-semibold">
            <span className="material-symbols-outlined text-sm">eco</span>
            Sustainable Investing in Mindanao
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-primary">
            Adopt a Tree.<br/>
            <span className="text-secondary">Own the Harvest.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            Own a real, named fruit tree on a Mindanao farm. Watch it grow. Receive your harvest.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link href="/trees">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all hover:gap-3" data-testid="button-hero-adopt">
                Adopt a Tree Now
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border w-full">
            <div>
              <div className="text-2xl font-bold text-primary font-serif">300</div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Founding Adopters Goal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-serif">8+</div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Fruit Varieties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-serif">100%</div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Direct from Mindanao Farms</div>
            </div>
          </div>
        </div>

        <div className="hidden md:block relative h-[600px] w-full">
          <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl">
            <img 
              src="/hero-orchard.png" 
              alt="Mindanao Orchard" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-white py-24 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-primary mb-16">
            Modern Stewardship in 4 Steps
          </h2>
          
          <div className="relative grid md:grid-cols-4 gap-12 text-center">
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-muted z-0"></div>
            
            {[
              { icon: "search", title: "Browse Real Trees" },
              { icon: "park", title: "We Plant & Tag It with a QR Code" },
              { icon: "insights", title: "Get Monthly Farm Updates" },
              { icon: "shopping_basket", title: "Receive Your Harvest at Your Door" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white border-[4px] border-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-primary max-w-[200px]">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trees */}
      <section id="trees" className="py-24 bg-[#FAFCFA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Featured Mindanao Varieties
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Select from our highest-yielding varieties, carefully nurtured in the fertile soils of Mindanao.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="tonal-card rounded-2xl overflow-hidden flex flex-col h-[400px]">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="mt-auto">
                      <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredTrees.map((tree) => (
                <div key={tree.id} className="tonal-card rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative h-56">
                    <img src={tree.imageUrl || "/tree-mangosteen.png"} alt={tree.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {tree.location}
                    </div>
                    <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {tree.tier}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-serif font-bold text-xl text-primary">{tree.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-secondary font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">scale</span>
                          {tree.estimatedHarvestKg}kg
                        </div>
                        <div className="text-xs text-muted-foreground">Est. Harvest</div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <div className="font-bold text-xl text-primary">₱{(tree.pricePerYear).toLocaleString()}/yr</div>
                      </div>
                      <Link href={`/adopt?treeId=${tree.id}`}>
                        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                          Adopt
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/trees">
              <button className="px-8 py-3 rounded-full font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors" data-testid="button-view-all-trees">
                View All Trees
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* For OFWs Section */}
      <section className="bg-[#E8F0E9] py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary">
            <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">For Filipinos Abroad</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Send a living piece of home. Gift a tree to your family in the Philippines and let them enjoy the harvest for years to come.
          </p>
          <Link href="/gift">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-colors" data-testid="button-ofw-gift">
              Explore Gifting Options
            </button>
          </Link>
        </div>
      </section>

      {/* Impact/Trust Section */}
      <section className="bg-primary text-white py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Investing in the Roots</h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-lg">
                We're bridging the gap between urban investors and local farmers. By adopting a tree, you provide upfront capital for sustainable farming practices, ensuring fair wages and ecological preservation in Mindanao.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-sm">restaurant</span></div>
                  <span className="font-semibold">SDG 2 — Zero Hunger</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-sm">work</span></div>
                  <span className="font-semibold">SDG 8 — Decent Work</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-sm">public</span></div>
                  <span className="font-semibold">SDG 15 — Life on Land</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-secondary rounded-[40px] rotate-6 transform scale-105 opacity-20"></div>
              <img 
                src="/farmer-portrait.png" 
                alt="Mindanao Farmer" 
                className="relative z-10 w-full h-[500px] object-cover rounded-[40px] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}