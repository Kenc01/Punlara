import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";

export default function MyTree() {
  return (
    <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Mabuhay, Juan! Here's your tree.</h1>
        </header>

        {/* Hero Banner */}
        <div className="w-full h-[400px] rounded-[24px] overflow-hidden relative mb-8 shadow-xl group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrJTuvrgBiJvjX7nS-vRJdqhFuPWVMh6X_lEA-3qaxz9K8cZiivUe9GgNRDMUPvNmF4S1Fc-oLlRKf5bIxOxCuZeVj0c7K7H6eAiBuWv1oAJL5RmSLPJd7V6c0jMaBBIBTMh9g_tCmS1PeOHEXMZ0dSZl91Z81PBqMYBnIpyJFbhSMp_B7hTf0" 
            alt="Cacao Tree" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-primary">Growing Strong</span>
          </div>

          <div className="absolute bottom-8 left-8 wooden-sign p-6 rounded-xl max-w-sm transform -rotate-2">
            <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1 border-b border-white/20 pb-1 inline-block">Estate Registered</div>
            <h1 className="font-serif text-3xl font-bold text-white mb-3">Laya</h1>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-sm text-xs font-semibold text-white border border-white/10">Cacao Tree</span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-sm text-xs font-semibold text-white border border-white/10">Davao PH</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Growth Timeline */}
            <div className="tonal-card p-6 md:p-8 rounded-[24px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-2xl font-bold text-primary">Growth Timeline</h2>
                <button className="text-sm font-semibold text-secondary hover:underline">View Full Report</button>
              </div>

              <div className="relative mb-12 mt-6">
                {/* Progress track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full progress-gradient w-[65%] rounded-full"></div>
                </div>
                
                {/* Milestones */}
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm z-10 flex items-center justify-center">
                       <span className="material-symbols-outlined text-[12px] text-white">check</span>
                    </div>
                    <span className="text-xs font-bold text-primary">Planted</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-sm z-10 flex items-center justify-center">
                       <span className="material-symbols-outlined text-[12px] text-white">check</span>
                    </div>
                    <span className="text-xs font-bold text-primary">Sprouting</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary border-4 border-white shadow-md z-10 flex items-center justify-center -mt-1">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    </div>
                    <span className="text-sm font-bold text-secondary">Growing</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted border-4 border-white shadow-sm z-10"></div>
                    <span className="text-xs font-bold text-muted-foreground">Harvest Ready</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFCFA] p-4 rounded-xl border border-border">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Current Height</div>
                  <div className="font-serif text-2xl font-bold text-primary">4.2 <span className="text-lg text-muted-foreground font-sans font-medium">meters</span></div>
                </div>
                <div className="bg-[#FAFCFA] p-4 rounded-xl border border-border">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Canopy Spread</div>
                  <div className="font-serif text-2xl font-bold text-primary">2.8 <span className="text-lg text-muted-foreground font-sans font-medium">meters</span></div>
                </div>
              </div>
            </div>

            {/* Farm Journal */}
            <div className="tonal-card p-6 md:p-8 rounded-[24px]">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="font-serif text-2xl font-bold text-primary">Farm Journal</h2>
                <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  Last update: 2 hours ago
                </div>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Entry 1 */}
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#E8F0E9] text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">content_cut</span>
                    </div>
                    <div className="w-px h-full bg-border my-2 group-last:hidden"></div>
                  </div>
                  <div className="pb-6">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Aug 14, 2024</div>
                    <h3 className="font-bold text-primary text-lg mb-2">Scheduled Maintenance</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      Quarterly pruning completed to encourage horizontal canopy growth. This ensures better sunlight distribution to the lower branches, which is critical for the upcoming fruiting season.
                    </p>
                    <div className="rounded-xl overflow-hidden h-32 w-48 shadow-sm">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBlN9BPj8JXj23Odln2MwOgRbVPv-XRdL0jdqi977w_C--OOpGiRNGPB32GKNn4bd3qQ38q1Qooy_tGBtrI7RaIOnbReN8hCsl6hfaTrL1sHZDZfpTvGGF3u3u557Sodfqz5Zngwtf8d1Qu3pDPDJQMLxh25mKDLN7BvIgSjSB8bcgMnUDJU2GiWxuD19nYoyVe63wR-M3Hjt9rPEpvhDO2E0Sie1uNtv2dZVGEngY5X7KvPjwH8etKZctmL8ekwu3d3S3JIolUqGN" alt="Pruning" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Entry 2 */}
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#E8F0E9] text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">biotech</span>
                    </div>
                    <div className="w-px h-full bg-border my-2 group-last:hidden"></div>
                  </div>
                  <div className="pb-6">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Aug 02, 2024</div>
                    <h3 className="font-bold text-primary text-lg mb-2">Digital Vitality Scan</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      Multispectral imaging completed via drone. Chlorophyll levels are optimal. Soil moisture in block C is slightly low, adjusting drip irrigation schedule accordingly.
                    </p>
                    <div className="rounded-xl overflow-hidden h-32 w-48 shadow-sm">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLNHtwZhrnhvi-KLYrZT-AMcobgTcl8IBW4gbBqAKOb1vqF2aCAzjzvsXMUYDDw0nZ5BeR3fiIPQZs--Lx-rOmnJgZvkcjU_CsvSri4GLp6cHTXQAqu8jy-Y3zLstZmonGW-GAczHEAbfa-sXY5lB3eUQ2ssX9ag0ZNG5agouH_e6nB7jBcCcoPxlCqD6uZUedJSaU-P3d9sm6wKF5jb3UTARpOyWcshpl6n6nGWTUX4DwiRU_nE03VkavXslLWrOv1ukMzeNge-bFbGQc" alt="Scan" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Entry 3 */}
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">rainy</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Jul 28, 2024</div>
                    <h3 className="font-bold text-primary text-lg mb-2">Weather Alert: Seasonal Monsoon</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Moderate rainfall expected over the next 48 hours. Drainage trenches have been cleared to prevent waterlogging around the root zone.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Delivery Status */}
            <div className="bg-white border-2 border-[#E8F0E9] rounded-[24px] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined absolute -right-6 -top-6 text-[120px] text-[#FAFCFA] z-0 select-none pointer-events-none">local_shipping</span>
              
              <div className="relative z-10">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Est. Delivery Month</div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-8">October 2025</h3>

                <div className="space-y-4 mb-8">
                  {[
                    { stage: "Preparing", active: true },
                    { stage: "Packed", active: false },
                    { stage: "In Transit", active: false },
                    { stage: "Delivered", active: false }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        step.active ? "bg-secondary border-secondary ring-4 ring-secondary/20" : "bg-white border-border"
                      }`}></div>
                      <span className={`font-semibold ${step.active ? "text-primary" : "text-muted-foreground"}`}>{step.stage}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full font-semibold transition-colors">
                  Track Delivery
                </button>
              </div>
            </div>

            {/* Forest Guardian Impact */}
            <div className="tonal-card rounded-[24px] p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">local_police</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-primary">Forest Guardian</h3>
                  <div className="text-xs font-semibold text-secondary">Level 4 Impact Tier</div>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#E8F0E9] text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">co2</span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">Carbon Sequestration</div>
                    <div className="text-muted-foreground text-sm">22kg CO2 offset this year</div>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">Ecosystem Service</div>
                    <div className="text-muted-foreground text-sm">1,200L groundwater retention</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">Community Support</div>
                    <div className="text-muted-foreground text-sm">0.5 fair-wage farming jobs</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFCFA] p-4 rounded-xl border border-border">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Earned Badges</div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1 group relative cursor-help">
                    <div className="w-10 h-10 rounded-full bg-[#FFF4E5] text-secondary border border-[#FDE0B2] flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary">Planter</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-[#FFF4E5] text-secondary border border-[#FDE0B2] flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_full</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary">Nurturer</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50 grayscale">
                    <div className="w-10 h-10 rounded-full bg-white border border-border text-muted-foreground flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">Harvester</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit CTA */}
            <div className="bg-[#1A5C2E] rounded-[24px] p-6 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="font-serif font-bold text-2xl mb-2 relative z-10">Visit Your Estate?</h3>
              <p className="text-white/80 text-sm mb-6 relative z-10">
                Experience the farm firsthand. Meet the farmers, see your tree, and enjoy the lush Mindanao landscape.
              </p>
              <button className="bg-white text-primary hover:bg-gray-100 w-full py-3 rounded-full font-semibold transition-colors relative z-10">
                Schedule Visit
              </button>
            </div>

          </div>
        </div>

      </div>
      <MobileNav />
    </div>
  );
}