import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { useListTrees, useGetTree, useCreateAdoption, useCreateCheckoutSession, useGetAdoption } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

export default function Adopt() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const treeIdParam = searchParams.get("treeId");
  const successParam = searchParams.get("success");
  const adoptionIdParam = searchParams.get("adoption");

  const [step, setStep] = useState(1);
  const [selectedTreeId, setSelectedTreeId] = useState<number | null>(treeIdParam ? parseInt(treeIdParam, 10) : null);
  const [createdAdoptionId, setCreatedAdoptionId] = useState<number | null>(null);

  const { toast } = useToast();

  const { data: allTrees, isLoading: isLoadingTrees } = useListTrees({ }, { query: { enabled: step === 1 && !selectedTreeId } });
  const { data: selectedTree, isLoading: isLoadingTree } = useGetTree(selectedTreeId || 0, { query: { enabled: !!selectedTreeId } });
  
  const createAdoption = useCreateAdoption();
  const createCheckout = useCreateCheckoutSession();
  
  const { data: successAdoption, isLoading: isLoadingAdoption } = useGetAdoption(
    parseInt(adoptionIdParam || "0"), 
    { query: { enabled: !!adoptionIdParam && successParam === "1" } }
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    treeName: "",
    message: "",
    isGift: false,
    recipientName: "",
    recipientEmail: ""
  });

  useEffect(() => {
    if (successParam === "1" && adoptionIdParam) {
      setStep(3);
    }
  }, [successParam, adoptionIdParam]);

  const handleSelectTree = (id: number) => {
    setSelectedTreeId(id);
  };

  const handleNext = () => {
    if (step === 1 && selectedTree) setStep(2);
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTreeId) return;

    createAdoption.mutate({
      data: {
        treeId: selectedTreeId,
        stewardName: formData.name,
        email: formData.email,
        phone: formData.phone,
        treeName: formData.treeName,
        dedicationMessage: formData.message,
        isGift: formData.isGift,
        recipientName: formData.isGift ? formData.recipientName : undefined,
        recipientEmail: formData.isGift ? formData.recipientEmail : undefined
      }
    }, {
      onSuccess: (data) => {
        setCreatedAdoptionId(data.id);
        setStep(3);
        toast({ title: "Adoption saved!", description: "Please complete your payment to activate." });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.error || "Failed to create adoption", variant: "destructive" });
      }
    });
  };

  const handleCheckout = () => {
    const adId = createdAdoptionId;
    if (!adId) return;

    createCheckout.mutate({
      data: { adoptionId: adId }
    }, {
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
      onError: (err) => {
        toast({ title: "Checkout Error", description: err.error || "Could not initiate checkout", variant: "destructive" });
      }
    });
  };

  const handlePayLater = () => {
    toast({ title: "Saved for later", description: "You can pay anytime from your dashboard." });
    setLocation("/my-tree");
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Progress Stepper (Hide on success) */}
        {!(successParam === "1") && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
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
                    {s === 1 ? "Summary" : s === 2 ? "Details" : "Checkout"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Summary */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            {!selectedTreeId ? (
               <div className="space-y-6">
                 <h2 className="font-serif text-3xl font-bold text-center text-primary mb-8">Choose Your Tree</h2>
                 {isLoadingTrees ? (
                   <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                     {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
                   </div>
                 ) : (
                   <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                     {allTrees?.filter(t => t.status === 'available').map(tree => (
                       <div key={tree.id} 
                            onClick={() => handleSelectTree(tree.id)}
                            className="card-shadow rounded-xl bg-white overflow-hidden cursor-pointer hover:border-primary transition-all">
                         <div className="h-40 w-full bg-muted">
                           <img src={tree.imageUrl || "/tree-mangosteen.png"} className="w-full h-full object-cover" alt={tree.name} />
                         </div>
                         <div className="p-4">
                           <h3 className="font-serif font-bold text-lg text-primary">{tree.name}</h3>
                           <div className="text-sm text-muted-foreground mb-2">{tree.location}</div>
                           <div className="font-bold text-primary">₱{(tree.pricePerYear).toLocaleString()}/yr</div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            ) : (
               isLoadingTree || !selectedTree ? (
                 <Skeleton className="h-96 w-full rounded-xl" />
               ) : (
                <div className="bg-white rounded-xl border border-border shadow-lg overflow-hidden max-w-2xl mx-auto">
                  <div className="relative h-64">
                    <img 
                      src={selectedTree.imageUrl || "/tree-mangosteen.png"} 
                      alt={selectedTree.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      Tier: {selectedTree.tier}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="font-serif text-3xl font-bold text-primary">{selectedTree.name}</h2>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-primary">₱{(selectedTree.pricePerYear).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">per year</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-8">
                      {selectedTree.description || `${selectedTree.species} — A beautiful tree from ${selectedTree.location}.`}
                    </p>
                    
                    <div className="space-y-4 mb-10 bg-[#FAFCFA] p-6 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Location</div>
                          <div className="font-semibold text-sm">{selectedTree.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">eco</span>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Est. Harvest</div>
                          <div className="font-semibold text-sm">{selectedTree.estimatedHarvestKg} kg/year</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">co2</span>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Carbon Offset</div>
                          <div className="font-semibold text-sm">{selectedTree.co2PerYear || 150}kg CO2/year</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button onClick={() => setSelectedTreeId(null)} className="text-muted-foreground hover:text-primary font-semibold">Change Tree</button>
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
               )
            )}
          </div>
        )}

        {/* Step 2: Details Form */}
        {step === 2 && selectedTree && (
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

                  <div className="md:col-span-2 space-y-2 pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-primary block">Is this a gift?</label>
                      <p className="text-xs text-muted-foreground">Send a living piece of home to someone you love.</p>
                    </div>
                    <Switch checked={formData.isGift} onCheckedChange={(c) => setFormData({...formData, isGift: c})} />
                  </div>

                  {formData.isGift && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary">Recipient Name</label>
                        <input 
                          required={formData.isGift}
                          type="text" 
                          className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Maria Santos"
                          value={formData.recipientName}
                          onChange={e => setFormData({...formData, recipientName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-primary">Recipient Email</label>
                        <input 
                          required={formData.isGift}
                          type="email" 
                          className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="maria@example.com"
                          value={formData.recipientEmail}
                          onChange={e => setFormData({...formData, recipientEmail: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-primary">Personal Message / Dedication (Optional)</label>
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
                    disabled={createAdoption.isPending}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    {createAdoption.isPending ? "Saving..." : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                        Save Adoption
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Checkout (before success) */}
        {step === 3 && !(successParam === "1") && selectedTree && (
           <div className="max-w-md mx-auto animate-in zoom-in duration-300">
             <div className="bg-white rounded-xl border border-border shadow-lg p-8 text-center">
                <h2 className="font-serif text-3xl font-bold text-primary mb-4">Almost there!</h2>
                <p className="text-muted-foreground mb-8">Complete your payment to activate your tree.</p>

                <div className="bg-[#FAFCFA] rounded-xl p-4 border border-border flex items-center gap-4 mb-8 text-left">
                  <img src={selectedTree.imageUrl || "/tree-mangosteen.png"} alt="Tree" className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-primary">{formData.treeName || selectedTree.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedTree.species} • {selectedTree.location}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-t border-b border-border py-4">
                  <span className="font-bold text-lg text-primary">Total</span>
                  <span className="font-bold text-2xl text-primary">₱{(selectedTree.pricePerYear).toLocaleString()}</span>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleCheckout}
                    disabled={createCheckout.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {createCheckout.isPending ? "Connecting..." : "Pay with GCash / Maya / Card"}
                  </button>
                  <button 
                    onClick={handlePayLater}
                    className="w-full text-primary border-2 border-border hover:border-primary px-8 py-3 rounded-full font-semibold transition-all"
                  >
                    Save & Pay Later
                  </button>
                </div>
             </div>
           </div>
        )}

        {/* Success / Certificate */}
        {step === 3 && successParam === "1" && (
          <div className="max-w-3xl mx-auto text-center animate-in zoom-in duration-500">
            {isLoadingAdoption ? (
              <Skeleton className="h-[600px] w-full rounded-2xl" />
            ) : successAdoption ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="font-serif text-4xl font-bold text-primary mb-2">Adoption Successful!</h2>
                <p className="text-lg text-muted-foreground mb-12">
                  Welcome to the Punlara family. Here is your official stewardship certificate.
                </p>

                {/* Certificate Card */}
                <div className="bg-white border-[8px] border-[#F4A726] rounded-xl shadow-2xl p-8 md:p-12 mb-10 text-left relative overflow-hidden print:border-4 print:shadow-none print:m-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 print:hidden"></div>
                  
                  <div className="flex flex-col items-center justify-center mb-10">
                    <span className="material-symbols-outlined text-primary text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
                    <span className="font-serif font-bold text-3xl text-primary tracking-widest uppercase">Punlara</span>
                  </div>

                  <div className="text-center mb-12 relative z-10">
                    <div className="text-sm tracking-[0.3em] text-muted-foreground font-bold mb-6">CERTIFICATE OF STEWARDSHIP</div>
                    <div className="font-serif text-6xl md:text-7xl font-bold text-secondary italic mb-4">
                      {successAdoption.treeName}
                    </div>
                    <div className="text-lg text-primary font-medium tracking-wide">
                      ( {successAdoption.tree?.name} • {successAdoption.tree?.species} )
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-border py-8 mb-8">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Steward</div>
                      <div className="font-bold text-primary text-sm">{successAdoption.stewardName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</div>
                      <div className="font-bold text-primary text-sm">{successAdoption.tree?.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date of Adoption</div>
                      <div className="font-bold text-primary text-sm">{new Date(successAdoption.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ID Number</div>
                      <div className="font-bold text-primary text-sm font-mono">{successAdoption.tree?.treeCode}</div>
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

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Download Certificate
                  </button>
                </div>
                
                <div className="mt-8 print:hidden">
                  <Link href="/my-tree">
                    <span className="text-primary font-semibold hover:underline cursor-pointer">Go to My Tree Dashboard →</span>
                  </Link>
                </div>
              </>
            ) : (
              <div>Could not load certificate</div>
            )}
          </div>
        )}

      </div>
      <MobileNav />
    </div>
  );
}