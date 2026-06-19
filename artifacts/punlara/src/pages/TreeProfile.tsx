import { useRoute, Link, useLocation } from "wouter";
import { useGetTree, useListJournalEntries } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function TreeProfile() {
  const [match, params] = useRoute("/tree/:id");
  const treeId = params?.id ? parseInt(params.id, 10) : 0;
  const [, setLocation] = useLocation();
  const { isAuthenticated, login } = useAuth();
  
  const { data: tree, isLoading, isError } = useGetTree(treeId, {
    query: { enabled: !!match && !!treeId }
  });

  const { data: journalEntries } = useListJournalEntries(treeId, {
    query: { enabled: !!match && !!treeId }
  });

  if (!match) return null;

  const handleAdopt = () => {
    if (!isAuthenticated) {
      login();
    } else {
      setLocation(`/adopt?treeId=${treeId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] md:flex md:items-center md:justify-center">
         <div className="max-w-md w-full bg-white md:rounded-[32px] md:shadow-2xl overflow-hidden min-h-screen md:min-h-0">
           <Skeleton className="h-[50vh] w-full rounded-none" />
           <div className="p-8">
             <Skeleton className="h-8 w-3/4 mb-4" />
             <Skeleton className="h-4 w-1/2 mb-8" />
             <Skeleton className="h-24 w-full mb-8" />
             <Skeleton className="h-12 w-full rounded-full" />
           </div>
         </div>
      </div>
    );
  }

  if (isError || !tree) {
    return (
      <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center p-4">
        <span className="material-symbols-outlined text-6xl text-muted mb-4">nature_people</span>
        <h1 className="font-serif text-2xl font-bold text-primary mb-2">Tree not found</h1>
        <p className="text-muted-foreground mb-6">This profile might be invalid or no longer available.</p>
        <Link href="/trees">
          <button className="bg-primary text-white px-6 py-2 rounded-full font-semibold">View Available Trees</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFA] md:flex md:items-center md:justify-center md:p-8">
      <div className="max-w-md w-full bg-white md:rounded-[32px] md:shadow-2xl overflow-hidden min-h-screen md:min-h-0 relative flex flex-col">
        
        {/* Back Button */}
        <Link href="/trees">
          <div className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/40 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </div>
        </Link>

        {/* Hero Image */}
        <div className="h-[45vh] w-full relative">
          <img src={tree.imageUrl || "/hero-orchard.png"} alt={tree.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tree.status === 'available' ? 'bg-green-500' : 'bg-amber-500'}`}>
                {tree.status === 'available' ? 'Available' : 'Adopted'}
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                {tree.tier}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight mb-1">{tree.name}</h1>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {tree.location}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Species</div>
              <div className="font-semibold text-primary">{tree.species}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">ID Number</div>
              <div className="font-mono font-bold text-primary">{tree.treeCode}</div>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {tree.description || `A beautiful ${tree.species} tree located in the rich soils of ${tree.location}. Known for its excellent yield and contribution to local biodiversity.`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#FAFCFA] border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-secondary text-2xl mb-2">scale</span>
              <div className="text-xl font-bold text-primary mb-1">{tree.estimatedHarvestKg}kg</div>
              <div className="text-xs text-muted-foreground font-medium">Est. Yearly Harvest</div>
            </div>
            <div className="bg-[#FAFCFA] border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-green-600 text-2xl mb-2">co2</span>
              <div className="text-xl font-bold text-primary mb-1">{tree.co2PerYear || 150}kg</div>
              <div className="text-xs text-muted-foreground font-medium">CO2 Offset / Year</div>
            </div>
          </div>

          <div className="mt-auto">
            {tree.status === 'available' ? (
              <div className="bg-[#E8F0E9] p-2 rounded-full flex items-center justify-between pl-6">
                <div className="font-bold text-primary">₱{(tree.pricePerYear).toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/yr</span></div>
                <button 
                  onClick={handleAdopt}
                  className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
                >
                  Adopt
                </button>
              </div>
            ) : (
              <div className="bg-[#FAFCFA] border border-border p-4 rounded-2xl flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div className="font-semibold text-primary">This tree has found its steward</div>
              </div>
            )}
          </div>

          {/* Farm Journal */}
          {journalEntries && journalEntries.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
                <h2 className="font-bold text-primary">Farm Journal</h2>
              </div>
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-[#FAFCFA] border border-border rounded-2xl overflow-hidden">
                    {entry.photoUrl && (
                      <img src={entry.photoUrl} alt={entry.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        {new Date(entry.entryDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      <p className="font-semibold text-primary text-sm mb-2">{entry.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{entry.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}