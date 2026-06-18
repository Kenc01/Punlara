import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

export default function Home() {
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
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all hover:gap-3">
                Adopt a Tree Now
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </Link>
            <button className="px-8 py-4 rounded-full font-semibold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all">
              View Impact Report
            </button>
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
          
          <div className="absolute -bottom-8 -right-8 glass-header p-6 rounded-2xl border border-white/40 shadow-xl w-64 animate-in slide-in-from-bottom duration-700 delay-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Live Growth</div>
                <div className="font-bold text-primary">+12.4% yield</div>
              </div>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[75%] rounded-full"></div>
            </div>
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
              { icon: "search", title: "Choose a Tree" },
              { icon: "park", title: "We Plant & Tag It" },
              { icon: "insights", title: "Get Monthly Updates" },
              { icon: "shopping_basket", title: "Receive Your Harvest" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white border-[4px] border-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-primary">{step.title}</h3>
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
            {[
              { name: "Mangosteen", price: "2,500", return: "14.2", loc: "Cotabato", img: "/tree-mangosteen.png", progress: 65 },
              { name: "Red Rambutan", price: "1,500", return: "11.8", loc: "Davao del Sur", img: "/tree-rambutan.png", progress: 80 },
              { name: "Camiguin Lanzones", price: "1,500", return: "16.5", loc: "Camiguin", img: "/tree-lanzones.png", progress: 45 }
            ].map((tree, i) => (
              <div key={i} className="tonal-card rounded-2xl overflow-hidden flex flex-col">
                <div className="relative h-56">
                  <img src={tree.img} alt={tree.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {tree.loc}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif font-bold text-xl text-primary">{tree.name}</h3>
                    <div className="text-right">
                      <div className="text-sm text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        {tree.return}%
                      </div>
                      <div className="text-xs text-muted-foreground">Est. Return</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Funding Progress</span>
                      <span>{tree.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full progress-gradient rounded-full" style={{ width: `${tree.progress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="font-bold text-xl text-primary">₱{tree.price}</div>
                      <div className="text-xs text-muted-foreground">per year</div>
                    </div>
                    <Link href="/adopt">
                      <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                        Adopt
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/trees">
              <button className="px-8 py-3 rounded-full font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                View All Trees
              </button>
            </Link>
          </div>
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
              
              <div className="grid grid-cols-2 gap-8">
                <div className="border-l-2 border-secondary pl-4">
                  <div className="text-4xl font-serif font-bold text-secondary mb-2">12,400+</div>
                  <div className="text-white/80 font-medium">Trees Planted</div>
                </div>
                <div className="border-l-2 border-secondary pl-4">
                  <div className="text-4xl font-serif font-bold text-secondary mb-2">240+</div>
                  <div className="text-white/80 font-medium">Local Farmers Supported</div>
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