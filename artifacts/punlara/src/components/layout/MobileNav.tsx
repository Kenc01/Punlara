import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/trees", icon: "park", label: "Trees" },
    { href: "/adopt", icon: "nature_people", label: "Adopt" },
    { href: "/my-tree", icon: "dashboard", label: "My Tree" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center justify-center w-16 cursor-pointer">
                <span 
                  className={`material-symbols-outlined text-2xl mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}