import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuth } from "@/hooks/use-auth";
import { useMyFarm } from "@/hooks/use-farmers";
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmerDashboard() {
  const { isAuthenticated, login } = useAuth();
  const { data: farm, isLoading, isError } = useMyFarm(isAuthenticated);
  const [activeTab, setActiveTab] = useState<"overview" | "trees" | "earnings">("overview");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 flex items-center justify-center">
        <Navbar />
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
          <span className="material-symbols-outlined text-5xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">Farmer Login Required</h2>
          <button onClick={() => login()} className="mt-4 w-full bg-primary text-white font-bold py-3 rounded-full">Log In</button>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (isError || !farm) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 flex items-center justify-center">
        <Navbar />
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border max-w-md w-full mx-4">
          <span className="material-symbols-outlined text-5xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
          <h2 className="font-serif text-2xl font-bold text-primary mb-2">No farm registered yet</h2>
          <p className="text-muted-foreground mb-6">Register your Mindanao farm to start listing trees and earning directly from adopters.</p>
          <Link href="/become-a-farmer">
            <button className="w-full bg-primary text-white font-bold py-3 rounded-full">Register My Farm</button>
          </Link>
        </div>
        <MobileNav />
      </div>
    );
  }

  const trees = farm.trees ?? [];
  const availableTrees = trees.filter(t => t.status === "available");
  const adoptedTrees = trees.filter(t => t.status === "adopted");
  const estimatedRevenue = adoptedTrees.reduce((sum, t) => sum + t.pricePerYear, 0);
  const farmerShare = Math.round(estimatedRevenue * (1 - parseFloat(farm.commissionRate)));
  const commissionPct = Math.round(parseFloat(farm.commissionRate) * 100);

  return (
    <div className="min-h-screen bg-[#FAFCFA] pt-20 pb-24 md:pb-12">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-2 ${farm.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {farm.status === "approved" ? "verified" : "schedule"}
              </span>
              {farm.status === "approved" ? "Farm Active" : "Application Pending Review"}
            </div>
            <h1 className="font-serif text-3xl font-bold text-primary">{farm.farmName}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {farm.location}
            </div>
          </div>
          {farm.status === "approved" && (
            <Link href={`/farm/${farm.id}`}>
              <button className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                View Public Profile
              </button>
            </Link>
          )}
        </div>

        {/* Pending notice */}
        {farm.status === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <span className="material-symbols-outlined text-amber-600 text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
            <div>
              <div className="font-bold text-amber-900 mb-1">Your application is under review</div>
              <p className="text-amber-800 text-sm">Our team typically reviews applications within 2–3 business days. You'll receive a notification once your farm is approved and listed on the marketplace.</p>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { icon: "park", label: "Trees Listed", value: trees.length, color: "text-primary", bg: "bg-[#E8F0E9]" },
            { icon: "favorite", label: "Trees Adopted", value: adoptedTrees.length, color: "text-green-700", bg: "bg-green-50" },
            { icon: "inventory_2", label: "Available", value: availableTrees.length, color: "text-blue-700", bg: "bg-blue-50" },
            { icon: "payments", label: "Est. Earnings/yr", value: `₱${farmerShare.toLocaleString()}`, color: "text-secondary", bg: "bg-secondary/10" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center ${stat.color} shrink-0`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</div>
                <div className={`font-serif text-xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 w-fit">
          {(["overview", "trees", "earnings"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Farm info */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-serif font-bold text-primary text-lg mb-4">Farm Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Farmer Name", value: farm.farmerName },
                  { label: "Contact", value: farm.phone || "—" },
                  { label: "Platform Commission", value: `${commissionPct}%` },
                  { label: "Your Share", value: `${100 - commissionPct}%` },
                  { label: "Member Since", value: new Date(farm.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "long" }) },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-primary">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-serif font-bold text-primary text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: "add_circle", label: "List a New Tree", desc: "Add a fruit tree to your marketplace", href: "/admin", color: "text-primary", disabled: farm.status !== "approved" },
                  { icon: "photo_camera", label: "Post Farm Update", desc: "Share a photo update for your adopters", href: "/admin", color: "text-blue-600", disabled: farm.status !== "approved" },
                  { icon: "person", label: "View Public Profile", desc: "See how adopters see your farm", href: `/farm/${farm.id}`, color: "text-green-700", disabled: farm.status !== "approved" },
                ].map(action => (
                  <Link key={action.label} href={action.disabled ? "#" : action.href}>
                    <div className={`flex items-center gap-4 p-3 rounded-xl border border-border transition-colors ${action.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/30 cursor-pointer"}`}>
                      <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${action.color}`}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{action.icon}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-primary text-sm">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.desc}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {farm.status !== "approved" && (
                <p className="text-xs text-muted-foreground mt-3">Actions unlock after farm approval.</p>
              )}
            </div>

            {/* Bio */}
            {farm.bio && (
              <div className="bg-white rounded-2xl border border-border p-6 lg:col-span-2">
                <h3 className="font-serif font-bold text-primary text-lg mb-3">About Your Farm</h3>
                <p className="text-muted-foreground leading-relaxed">{farm.bio}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "trees" && (
          <div>
            {trees.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-border">
                <span className="material-symbols-outlined text-4xl text-muted mb-3">park</span>
                <h3 className="font-serif font-bold text-primary text-xl mb-2">No trees listed yet</h3>
                <p className="text-muted-foreground mb-4">Once your farm is approved, our team will help you list your fruit trees on the marketplace.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {trees.map(tree => (
                  <div key={tree.id} className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="relative aspect-video">
                      <img src={tree.imageUrl || "/hero-orchard.png"} alt={tree.name} className="w-full h-full object-cover" />
                      <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${tree.status === "available" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                        {tree.status === "available" ? "Available" : "Adopted"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-primary mb-0.5">{tree.name}</h3>
                      <div className="text-xs text-muted-foreground mb-3">{tree.tier} · {tree.species}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-bold text-primary">₱{tree.pricePerYear.toLocaleString()}/yr</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Your share</span>
                        <span className="font-semibold text-green-700">₱{Math.round(tree.pricePerYear * (1 - parseFloat(farm.commissionRate))).toLocaleString()}/yr</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-serif font-bold text-primary text-lg mb-6">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm">Total Adoption Revenue</span>
                  <span className="font-bold text-primary">₱{estimatedRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm">Platform Commission ({commissionPct}%)</span>
                  <span className="font-semibold text-red-500">−₱{(estimatedRevenue - farmerShare).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-bold text-primary">Your Estimated Earnings</span>
                  <span className="font-bold text-green-700 text-xl">₱{farmerShare.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Based on {adoptedTrees.length} active adoption(s). Payments are disbursed monthly after harvest delivery confirmation.</p>
            </div>

            <div className="bg-[#E8F0E9] rounded-2xl p-6">
              <h3 className="font-serif font-bold text-primary text-lg mb-4">Earnings Potential</h3>
              <p className="text-sm text-muted-foreground mb-4">If all {trees.length || farm.treeCount} of your trees were adopted across all tiers:</p>
              <div className="space-y-3">
                {[
                  { tier: "Seedling", price: 1500 },
                  { tier: "Classic", price: 2500 },
                  { tier: "Premium", price: 4500 },
                ].map(({ tier, price }) => {
                  const count = trees.length || farm.treeCount || 10;
                  const share = Math.round(count * price * (1 - parseFloat(farm.commissionRate)));
                  return (
                    <div key={tier} className="flex items-center justify-between bg-white rounded-xl p-3">
                      <span className="text-sm font-semibold text-primary">{tier} tier ({count} trees)</span>
                      <span className="text-sm font-bold text-green-700">₱{share.toLocaleString()}/yr</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
