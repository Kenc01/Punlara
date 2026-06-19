import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Gift() {
  const { toast } = useToast();

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Inquiry Sent", description: "We'll contact you within 24 hours!" });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16 md:pb-0">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6">
          Gift a Tree.<br/><span className="text-secondary">Make It Personal.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          The perfect corporate gift or meaningful present for loved ones abroad. Send a living piece of home that gives back year after year.
        </p>
        <Link href="/adopt">
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            Start Gifting Now
          </button>
        </Link>
      </section>

      {/* Why Section */}
      <section className="bg-white py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-[#E8F0E9] rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="material-symbols-outlined text-3xl">eco</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">Eco-Friendly</h3>
              <p className="text-muted-foreground">A gift that cleans the air and supports sustainable farming in Mindanao.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#FFF4E5] rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
                <span className="material-symbols-outlined text-3xl">favorite</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">Meaningful</h3>
              <p className="text-muted-foreground">A personalized digital certificate and living legacy they can watch grow.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-primary mb-3">Tax-Deductible</h3>
              <p className="text-muted-foreground">Corporate gifting adoptions qualify as CSR initiatives for tax benefits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-[#FAFCFA]">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-primary mb-16">Gift Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Seedling */}
            <div className="bg-white rounded-2xl p-8 border border-border shadow-sm flex flex-col">
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Seedling Gift</div>
              <div className="font-serif text-3xl font-bold text-primary mb-6">₱1,500<span className="text-lg font-sans font-normal text-muted-foreground">/yr</span></div>
              <p className="text-sm text-muted-foreground mb-6">Calamansi or similar starter trees.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-primary font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Digital Certificate</li>
                <li className="flex items-center gap-3 text-sm text-primary font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Monthly Updates</li>
              </ul>
            </div>

            {/* Classic */}
            <div className="bg-primary rounded-2xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">Most Popular</div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Classic Gift</div>
              <div className="font-serif text-3xl font-bold text-white mb-6">₱2,500<span className="text-lg font-sans font-normal text-white/70">/yr</span></div>
              <p className="text-sm text-white/80 mb-6">Rambutan, Pomelo, or Lanzones.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Digital Certificate</li>
                <li className="flex items-center gap-3 text-sm text-white font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Monthly Updates</li>
                <li className="flex items-center gap-3 text-sm text-white font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Harvest Delivery</li>
              </ul>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl p-8 border border-border shadow-sm flex flex-col">
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Premium Gift</div>
              <div className="font-serif text-3xl font-bold text-primary mb-6">₱4,500<span className="text-lg font-sans font-normal text-muted-foreground">/yr</span></div>
              <p className="text-sm text-muted-foreground mb-6">Mango, Durian, or Mangosteen.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-primary font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Digital Certificate</li>
                <li className="flex items-center gap-3 text-sm text-primary font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Monthly Updates</li>
                <li className="flex items-center gap-3 text-sm text-primary font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Harvest Delivery</li>
                <li className="flex items-center gap-3 text-sm text-primary font-medium"><span className="material-symbols-outlined text-secondary text-sm">check_circle</span> Physical Tag</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Form */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Corporate Inquiry</h2>
            <p className="text-muted-foreground">Buying more than 10 trees? Contact us for bulk pricing and custom CSR integrations.</p>
          </div>
          
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Company Name" className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              <input required type="text" placeholder="Contact Person" className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required type="email" placeholder="Email Address" className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              <input required type="tel" placeholder="Phone Number" className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            </div>
            <input required type="number" placeholder="Estimated No. of Trees" className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            <textarea placeholder="Message / Specific Requirements" className="w-full bg-[#FAFCFA] border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary min-h-[120px]"></textarea>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors">Submit Inquiry</button>
          </form>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}