import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { useListTrees } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Trees() {
  const [typeFilter, setTypeFilter] = useState("All Fruits");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  
  const { data: trees, isLoading } = useListTrees();
  const { isAuthenticated, login } = useAuth();
  const [, setLocation] = useLocation();

  const filteredTrees = trees?.filter(tree => {
    if (typeFilter !== "All Fruits" && tree.species !== typeFilter) return false;
    if (tierFilter !== "All Tiers" && tree.tier !== tierFilter) return false;
    if (locationFilter !== "All Locations" && !tree.location.includes(locationFilter)) return false;
    return true;
  }) || [];

  // Get unique species for filter
  const speciesList = Array.from(new Set(trees?.map(t => t.species) || []));

  const handleAdoptClick = (treeId: number) => {
    if (!isAuthenticated) {
      login();
    } else {
      setLocation(`/adopt?treeId=${treeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Available Fruit Trees</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our curated selection of high-yield fruit trees ready for adoption.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="bg-white border border-border rounded-xl p-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="All Fruits">All Fruits</option>
              {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <select 
              value={tierFilter} 
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="All Tiers">All Tiers</option>
              <option value="Premium">Premium</option>
              <option value="Classic">Classic</option>
              <option value="Seedling">Seedling</option>
            </select>
            
            <select 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="All Locations">All Locations</option>
              <option value="Davao">Davao</option>
              <option value="Cotabato">Cotabato</option>
              <option value="Iloilo">Iloilo</option>
              <option value="Batangas">Batangas</option>
              <option value="Camiguin">Camiguin</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
            <span className="text-sm font-semibold text-primary">{filteredTrees.length} Trees Found</span>
          </div>
        </div>

        {/* Tree Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {Array(4).fill(0).map((_, i) => (
                <div key={i} className="card-shadow rounded-xl bg-white overflow-hidden flex flex-col h-[400px]">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="mt-auto">
                      <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : filteredTrees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrees.map((tree) => (
              <div key={tree.id} className="card-shadow rounded-xl bg-white overflow-hidden flex flex-col">
                <div className="relative aspect-video">
                  <img src={tree.imageUrl || "/tree-mangosteen.png"} alt={tree.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {tree.tier}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-serif font-bold text-lg text-primary mb-1 truncate cursor-help">{tree.name}</h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tree.description || "A beautiful fruit tree in Mindanao."}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {tree.location}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Adoption</span>
                      <span className="font-bold text-primary">₱{(tree.pricePerYear).toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Est. Harvest</span>
                      <span className="font-semibold">{tree.estimatedHarvestKg}kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-semibold ${tree.status === 'available' ? 'text-green-600' : 'text-amber-600'}`}>
                        {tree.status === 'available' ? 'Available' : 'Adopted'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border">
                    {tree.status === 'available' ? (
                      <button 
                        onClick={() => handleAdoptClick(tree.id)}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-full font-semibold transition-colors"
                        data-testid={`button-adopt-${tree.id}`}
                      >
                        Adopt This Tree
                      </button>
                    ) : (
                      <button disabled className="w-full bg-muted text-muted-foreground py-2.5 rounded-full font-semibold opacity-75 cursor-not-allowed" data-testid={`button-adopted-${tree.id}`}>
                        Adopted
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl border border-border">
            <span className="material-symbols-outlined text-4xl text-muted mb-4">nature</span>
            <h3 className="font-serif font-bold text-xl text-primary mb-2">No trees found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more trees.</p>
          </div>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}