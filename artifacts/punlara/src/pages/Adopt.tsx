import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

export default function Adopt() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    treeName: "",
    message: ""
  });

  const handleNext = () => setStep(2);
  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Progress Stepper */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= s ? "bg-[#00431b] text-white" : "bg-white border-2 border-border text-muted-foreground"
                }`}>
                  {s < step ? <span className="material-symbols-outlined text-[20px]">check</span> : s}
                </div>
                <span className={`text-xs font-semibold ${step >= s ? "text-primary" : "text-muted-foreground"}`}>
                  {s === 1 ? "Summary" : s === 2 ? "Details" : "Certificate"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Summary */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white rounded-xl border border-border shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5eLMn6JWWPK9B2GlPbCxVNGz-oQN0DqXkRkdMjpTJkH3kNLrFhR_eT9BPQM8gJuMrIrPvK2MwU8mF9APCL_-UT3u6P_C4o6CakIUk5mIrJMIY4QJI9nXMCOjE-ZqEgGK5mJqJxHa-d3YdwJhgqmIcGR6EH_2c9N1z6XY_3d61mOKJJFSIOkBSfGDGPR-h_z_gQkZ2-TlXjFa-MBG1iRpVMr2w4M-Td-Xv9FqD6-rJz-LKKrfwpYzCJT5Z8wXz-jRgXkJp-d" 
                  alt="Heritage Narra" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  Tier: Rare Species
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-serif text-3xl font-bold text-primary">Heritage Narra</h2>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-primary">₱4,500</div>
                    <div className="text-xs text-muted-foreground">per year</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-8">
                  Pterocarpus indicus — The National Tree of the Philippines. Known for its strength and resilience.
                </p>
                
                <div className="space-y-4 mb-10 bg-[#FAFCFA] p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="font-semibold text-sm">Davao Mindanao</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">eco</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Carbon Offset</div>
                      <div className="font-semibold text-sm">150kg CO2/year</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="font-semibold text-sm">Certified Sapling</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:gap-3"
                  >
                    Continue to Details
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-[#E8F0E9] p-6 rounded-xl text-primary italic text-center">
              "By adopting this Narra, you are contributing to the reforestation of the Maramag highlands..."
            </div>
          </div>
        )}

        {/* Step 2: Details Form */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white rounded-xl border border-border shadow-lg p-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-6">Steward Details</h2>
              
              <form onSubmit={handleFinalize} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-primary">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Juan Dela Cruz"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="juan@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 bg-muted border border-r-0 border-border rounded-l-lg text-sm text-muted-foreground font-medium">
                        +63
                      </span>
                      <input 
                        required
                        type="tel" 
                        className="w-full bg-[#FAFCFA] border border-border rounded-r-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="912 345 6789"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2 pt-4 border-t border-border">
                    <label className="text-sm font-semibold text-primary">Name Your Tree</label>
                    <p className="text-xs text-muted-foreground mb-2">This name will appear on the digital certificate and the physical tag.</p>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. Laya"
                      value={formData.treeName}
                      onChange={e => setFormData({...formData, treeName: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-primary">Personal Message / Dedication</label>
                    <textarea 
                      className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-y"
                      placeholder="Write a message for the future..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-muted-foreground hover:text-primary font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    Finalize Adoption
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Certificate */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto text-center animate-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary mb-2">Adoption Successful!</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Welcome to the Punlara family. Here is your official stewardship certificate.
            </p>

            {/* Certificate Card */}
            <div className="bg-white border-[8px] border-[#F4A726] rounded-xl shadow-2xl p-8 md:p-12 mb-10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="flex flex-col items-center justify-center mb-10">
                <span className="material-symbols-outlined text-primary text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
                <span className="font-serif font-bold text-3xl text-primary tracking-widest uppercase">Punlara</span>
              </div>

              <div className="text-center mb-12 relative z-10">
                <div className="text-sm tracking-[0.3em] text-muted-foreground font-bold mb-6">CERTIFICATE OF STEWARDSHIP</div>
                <div className="font-serif text-6xl md:text-7xl font-bold text-secondary italic mb-4">
                  {formData.treeName || "Laya"}
                </div>
                <div className="text-lg text-primary font-medium tracking-wide">
                  ( Heritage Narra • Pterocarpus indicus )
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-border py-8 mb-8">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Steward</div>
                  <div className="font-bold text-primary text-sm">{formData.name || "Juan Dela Cruz"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</div>
                  <div className="font-bold text-primary text-sm">Davao Mindanao</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date of Adoption</div>
                  <div className="font-bold text-primary text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ID Number</div>
                  <div className="font-bold text-primary text-sm font-mono">PNL-NRR-2024-089</div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="w-24 h-24 bg-white border-2 border-border p-2 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-muted-foreground">qr_code_2</span>
                </div>
                <div className="text-center">
                  <div className="w-48 border-b-2 border-primary mb-2"></div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">Official Seal</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Download Certificate
              </button>
              <button className="w-full sm:w-auto border-2 border-border hover:border-primary text-primary px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[20px]">share</span>
                Share Impact
              </button>
            </div>
            
            <div className="mt-8">
              <Link href="/my-tree">
                <span className="text-primary font-semibold hover:underline cursor-pointer">Go to My Tree Dashboard →</span>
              </Link>
            </div>
          </div>
        )}

      </div>
      <MobileNav />
    </div>
  );
}