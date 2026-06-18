import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/trees", label: "Our Trees" },
    { href: "/#how", label: "How It Works" },
    { href: "/my-tree", label: "My Tree" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-border">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
            <span className="font-serif font-bold text-2xl text-primary tracking-tight">Punlara</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm font-medium transition-colors cursor-pointer ${
                location === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/adopt">
            <button className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-2.5 px-6 rounded-full transition-all">
              Adopt Now
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}