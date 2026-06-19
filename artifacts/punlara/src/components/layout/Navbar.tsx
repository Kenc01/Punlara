import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SignInButton, UserButton } from "@clerk/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/trees", label: "Our Trees" },
    { href: "/#how", label: "How It Works", isHash: true },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: "/my-tree", label: "My Tree" });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-border">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
            <span className="font-serif font-bold text-2xl text-primary tracking-tight">Punlara</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isHash ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:text-primary"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium transition-colors cursor-pointer ${
                  location === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`} data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {link.label}
                </span>
              </Link>
            )
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <SignInButton mode="modal">
              <button
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                data-testid="button-login"
              >
                Log In
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-border",
                  },
                }}
                afterSignOutUrl="/"
              />
              <span className="text-sm font-medium text-primary hidden lg:inline-block" data-testid="text-username">
                {user?.firstName || "User"}
              </span>
            </div>
          )}

          <Link href="/adopt">
            <button className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-2.5 px-6 rounded-full transition-all" data-testid="button-adopt-now">
              Adopt Now
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
