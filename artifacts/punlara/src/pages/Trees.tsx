import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

const ALL_TREES = [
  {
    id: 1,
    name: "Carabao Mango #102",
    price: "5,000",
    location: "Guimaras Farm Iloilo", /* Keeping as requested despite brand saying Mindanao */
    harvest: "120kg",
    tier: "Premium",
    status: "Available",
    type: "Mango",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Ly-8CTTQELHTbXMEETBkKECoX64x7XjBJygtWRLC9deOLOF6hBYkUiiNUCI8K5NpVQNCvKbECq7l_V8XnBnblU10gIhBnFArRKw2LDluuewITbWZsm2zhiYXGeJvHOYK4MqBPsSpbS4G6sqHgCYOA3CgnbY8X2nP5Z695jTG_eZo16ZtLRsy-BFNGhf6035M0ghmWRHLzhV18Atxo9_AnnMT5Ga5Kg2PQG4sawZw9FLw3Z2gq5riXaVccmkw59BCy-rlgdYySmsc"
  },
  {
    id: 2,
    name: "Puyat Durian #055",
    price: "4,200",
    location: "Calinan Davao City",
    harvest: "80kg",
    tier: "Classic",
    status: "Adopted",
    type: "Durian",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWZRbaifp-GihSAG3j5gJ5c_zNi9wo6zWklILjdQ9yv6_d2IoO2cBRqq0s356IvlXzS3ejYQnoTGv_wKoK4y5kqpWe1pact6SKpnrNFYX8Lh9RUYLk05hIOCmfViC45h2F_2mno6iCalAVJoc5s7YLq7r6Z8lOchcLu9vSdDTPLKMnZJIAoT-4zZxFDNBqvxgtOlzGvrZFQIo-H9PnP8xlg8wGVcUFCgPjFM-jTGAJKHnP1AbCVpkKm1MtkBJCipw7M_hwI6BRzqs8"
  },
  {
    id: 3,
    name: "Calamansi #304",
    price: "1,500",
    location: "Lipa Batangas",
    harvest: "15kg",
    tier: "Seedling",
    status: "Available",
    type: "Calamansi",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEOkMPTo6VJJYIajxfNB-Wb2jWoxfzXi50_wKMb7P96I3u3yHkNLwqKa7C7gMkKxLsIFKqAHXIvTPEvgdKUbZ0u9hf_yGx9taKng7nJitg5QJfVqf7tMFOgDy68hkrTuIUkrqkVcCCNzIHYB12PhOXtn-sKbNbBgmn322FdTRgXD3iQa4ED-e4-i3h"
  },
  {
    id: 4,
    name: "Raintree Pomelo #210",
    price: "4,800",
    location: "Tagum Davao del Norte",
    harvest: "100kg",
    tier: "Premium",
    status: "Available",
    type: "Pomelo",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT7rgxRHQBV1WqAnMpSoPU-XM8HkyNsHqv7mbqWJ5lPtbMEWUFuex80Dm5eWKdEZ_FXKruJ_Z57A-pmzR-Q2YDbfJzdmubVwc_w2ss98QvJOQyGOKOhy6yqT2SOzIZtbQqGx2aDn7c8dy_oKmfdz9zwEi1bjUtduLjHdeXotfzzx2FUUGONjyP5iriaxKAGsRcA4bqv2Gno6yL"
  },
  {
    id: 5,
    name: "Mangosteen #112",
    price: "6,000",
    location: "Kidapawan Cotabato",
    harvest: "60kg",
    tier: "Premium",
    status: "Available",
    type: "Mangosteen",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIeg_nwn8pwq6XKsUZNRlarXtBJ3THadHxUzYm9x4xYkhdWmHJcgFsMEB8ssJOg_urCqecs3sJ1BsBsuq4AVHVsvOQJEZ2omUInICYDZxzYALXqNzGZ39PpQEZkCNXQ3I2h24sOvACKWTHUFJcvyCdXARqgFf27T_f8ZslqgwuVu_8Mdl3X08LNYyvsljW2ZHP5m97Q-GWSyLsSvfef4Nd8D6q8szHMR1-JWkZnOYY_w4P6ZNZdjj7r5kDqyVSzMbGvS3iCaBfVtkx"
  },
  {
    id: 6,
    name: "Rambutan #405",
    price: "3,500",
    location: "Bansalan Davao del Sur",
    harvest: "45kg",
    tier: "Classic",
    status: "Adopted",
    type: "Rambutan",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYCxyETZX4HXzZe2MFF1aB-A9WdyTD6uoW4w_Hrfm-qBCROyjzvsXMUYDDw0nZ5BeR3fiIPQZs--Lx-rOmnJgZvkcjU_CsvSri4GLp6cHTXQAqu8jy-Y3zLstZmonGW-GAczHEAbfa-sXY5lB3eUQ2ssX9ag0ZNG5agouH_e6nB7jBcCcoPxlCqD6uZUedJSaU-P3d9sm6wKF5jb3UTARpOyWcshpl6n6nGWTUX4DwiRU_nE03VkavXslLWrOv1ukMzeNge-bFbGQc"
  }
];

export default function Trees() {
  const [typeFilter, setTypeFilter] = useState("All Fruits");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  const filteredTrees = ALL_TREES.filter(tree => {
    if (typeFilter !== "All Fruits" && tree.type !== typeFilter) return false;
    if (tierFilter !== "All Tiers" && tree.tier !== tierFilter) return false;
    if (locationFilter !== "All Locations" && !tree.location.includes(locationFilter)) return false;
    return true;
  });

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
              <option value="Mango">Mango</option>
              <option value="Durian">Durian</option>
              <option value="Pomelo">Pomelo</option>
              <option value="Mangosteen">Mangosteen</option>
              <option value="Calamansi">Calamansi</option>
              <option value="Rambutan">Rambutan</option>
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
              <option value="Davao">Davao Region</option>
              <option value="Cotabato">Cotabato</option>
              <option value="Iloilo">Iloilo</option>
              <option value="Batangas">Batangas</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
            <span className="text-sm font-semibold text-primary">{filteredTrees.length} Trees Found</span>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">sort</span>
              Sort
            </button>
          </div>
        </div>

        {/* Tree Grid */}
        {filteredTrees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrees.map((tree) => (
              <div key={tree.id} className="card-shadow rounded-xl bg-white overflow-hidden flex flex-col">
                <div className="relative aspect-video">
                  <img src={tree.img} alt={tree.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {tree.tier}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-lg text-primary mb-1">{tree.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {tree.location}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Adoption</span>
                      <span className="font-bold text-primary">₱{tree.price}/yr</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Est. Harvest</span>
                      <span className="font-semibold">{tree.harvest}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-semibold ${tree.status === 'Available' ? 'text-green-600' : 'text-amber-600'}`}>
                        {tree.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border">
                    {tree.status === 'Available' ? (
                      <Link href="/adopt">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-full font-semibold transition-colors">
                          Adopt This Tree
                        </button>
                      </Link>
                    ) : (
                      <button disabled className="w-full bg-muted text-muted-foreground py-2.5 rounded-full font-semibold opacity-75 cursor-not-allowed">
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
            <p className="text-muted-foreground">Try adjusting your filters to see more available trees.</p>
          </div>
        )}

        {filteredTrees.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded-full font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
              Load More Trees
            </button>
          </div>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}