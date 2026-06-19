import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuth } from "@/hooks/use-auth";
import { useRegisterFarm, useMyFarm } from "@/hooks/use-farmers";
import { useToast } from "@/hooks/use-toast";

const REGIONS = [
  "Zamboanga del Norte, Mindanao",
  "Zamboanga del Sur, Mindanao",
  "Zamboanga Sibugay, Mindanao",
  "Davao del Sur, Mindanao",
  "Davao del Norte, Mindanao",
  "Davao Oriental, Mindanao",
  "Davao de Oro, Mindanao",
  "North Cotabato, Mindanao",
  "Bukidnon, Mindanao",
  "Misamis Oriental, Mindanao",
  "Misamis Occidental, Mindanao",
  "Lanao del Norte, Mindanao",
  "Camiguin, Mindanao",
];

export default function FarmerRegister() {
  const { isAuthenticated, login } = useAuth();
  const { data: existingFarm, isLoading: checkingFarm } = useMyFarm(isAuthenticated);
  const registerFarm = useRegisterFarm();
  const { toast } = useToast();

  const [form, setForm] = useState({
    farmName: "",
    farmerName: "",
    location: REGIONS[0],
    bio: "",
    phone: "",
    treeCount: "",
    imageUrl: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12 flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
          <span className="material-symbols-outlined text-5xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
            agriculture
          </span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">Log in to become a Partner Farmer</h2>
          <p className="text-muted-foreground mb-6">Join the Punlara network and connect your Mindanao farm with adopters across the Philippines.</p>
          <button onClick={() => login()} className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-primary/90 transition-colors">
            Log In to Continue
          </button>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (checkingFarm) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 flex items-center justify-center">
        <Navbar />
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <MobileNav />
      </div>
    );
  }

  if (existingFarm) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12 flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${existingFarm.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {existingFarm.status === "approved" ? "check_circle" : "schedule"}
            </span>
            {existingFarm.status === "approved" ? "Farm Approved" : "Application Under Review"}
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">{existingFarm.farmName}</h2>
          <p className="text-muted-foreground mb-6">
            {existingFarm.status === "approved"
              ? "Your farm is active on the Punlara marketplace. Manage your trees from the farmer dashboard."
              : "Your application is being reviewed by our team. We'll notify you once approved. This typically takes 2–3 business days."}
          </p>
          {existingFarm.status === "approved" && (
            <Link href="/farmer-dashboard">
              <button className="w-full bg-primary text-white font-bold py-3 rounded-full hover:bg-primary/90 transition-colors">
                Go to Farmer Dashboard
              </button>
            </Link>
          )}
        </div>
        <MobileNav />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmName || !form.farmerName || !form.phone) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    registerFarm.mutate({
      farmName: form.farmName,
      farmerName: form.farmerName,
      location: form.location,
      bio: form.bio,
      phone: form.phone,
      treeCount: parseInt(form.treeCount) || 0,
      imageUrl: form.imageUrl || undefined,
    }, {
      onSuccess: () => {
        toast({ title: "Application submitted!", description: "We'll review your farm and get back to you within 2–3 business days." });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="material-symbols-outlined text-sm">agriculture</span>
            Punlara Partner Farmer Programme
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">List Your Trees. Earn More.</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Join the Airbnb of fruit trees. Connect your Mindanao farm directly with urban adopters — no middlemen, fair income, digital management.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white border-b border-border py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "trending_up", title: "80–85% Earnings", desc: "Keep the majority of every adoption fee. Punlara takes only 15–20% commission." },
              { icon: "group", title: "Direct Adopters", desc: "Connect with urban Filipinos and OFWs who want to adopt a real tree with a real story." },
              { icon: "smartphone", title: "Digital Management", desc: "Manage your trees, post updates, and track adoptions from your phone." },
            ].map((b) => (
              <div key={b.icon} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#E8F0E9] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                </div>
                <h3 className="font-serif font-bold text-primary">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration form */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-2xl">
        <div className="bg-white rounded-[24px] border border-border p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">Apply as a Partner Farmer</h2>
          <p className="text-muted-foreground mb-8 text-sm">All fields marked with * are required. Our team reviews every application within 2–3 business days.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Farm Name *</label>
                <input
                  type="text"
                  value={form.farmName}
                  onChange={e => setForm(f => ({ ...f, farmName: e.target.value }))}
                  placeholder="e.g. Dela Cruz Family Farm"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Your Full Name *</label>
                <input
                  type="text"
                  value={form.farmerName}
                  onChange={e => setForm(f => ({ ...f, farmerName: e.target.value }))}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Farm Location *</label>
              <select
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Contact Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Number of Trees to List</label>
                <input
                  type="number"
                  value={form.treeCount}
                  onChange={e => setForm(f => ({ ...f, treeCount: e.target.value }))}
                  placeholder="e.g. 20"
                  min={1}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Tell us about your farm</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="What fruits do you grow? How long have you been farming? What makes your farm special?"
                rows={4}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">Farm Photo URL <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Earnings preview */}
            {form.treeCount && parseInt(form.treeCount) > 0 && (
              <div className="bg-[#E8F0E9] rounded-xl p-4">
                <div className="text-sm font-bold text-primary mb-3">Estimated Annual Earnings Preview</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { tier: "Seedling", price: 1500 },
                    { tier: "Classic", price: 2500 },
                    { tier: "Premium", price: 4500 },
                  ].map(({ tier, price }) => {
                    const trees = parseInt(form.treeCount) || 0;
                    const earnings = Math.round(trees * price * 0.825);
                    return (
                      <div key={tier} className="bg-white rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">{tier}</div>
                        <div className="font-bold text-primary text-sm">₱{earnings.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">if all {trees} trees</div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Based on 82.5% payout rate after 17.5% platform commission. Actual earnings vary by tier and adoption rate.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={registerFarm.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full transition-colors disabled:opacity-60"
            >
              {registerFarm.isPending ? "Submitting..." : "Submit My Farm Application"}
            </button>
          </form>
        </div>

        {/* Requirements checklist */}
        <div className="mt-8 bg-white rounded-2xl border border-border p-6">
          <h3 className="font-serif font-bold text-primary mb-4">What We Check During Review</h3>
          <div className="space-y-3">
            {[
              "Valid farm location within Zamboanga Peninsula or Mindanao",
              "Minimum 10 fruit trees available for listing",
              "Smartphone access for updates and order tracking",
              "Willingness to provide monthly photo updates per adopted tree",
            ].map((req) => (
              <div key={req} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
