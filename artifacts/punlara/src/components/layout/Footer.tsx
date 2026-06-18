import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
            <span className="font-serif font-bold text-2xl tracking-tight">Punlara</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/"><span className="text-white/80 hover:text-white cursor-pointer transition-colors">Home</span></Link>
            <Link href="/trees"><span className="text-white/80 hover:text-white cursor-pointer transition-colors">Our Trees</span></Link>
            <Link href="/#how"><span className="text-white/80 hover:text-white cursor-pointer transition-colors">How It Works</span></Link>
            <Link href="/my-tree"><span className="text-white/80 hover:text-white cursor-pointer transition-colors">My Tree</span></Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-sm">share</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} Punlara. Rooted in Mindanao. Delivered to You.
        </div>
      </div>
    </footer>
  );
}