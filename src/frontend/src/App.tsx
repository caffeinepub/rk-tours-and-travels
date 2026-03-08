import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Compass,
  Globe,
  Headphones,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type Inquiry, Region, type TourPackage } from "./backend";
import { useActor } from "./hooks/useActor";
import { usePackagesByRegion } from "./hooks/useQueries";

// ─── Region filter tabs ────────────────────────────────────────────────────────
type RegionFilter = "all" | Region;

const REGION_LABELS: Record<RegionFilter, string> = {
  all: "All India",
  [Region.north]: "North",
  [Region.south]: "South",
  [Region.east]: "East",
  [Region.west]: "West",
  [Region.central]: "Central",
};

const REGION_FILTERS: RegionFilter[] = [
  "all",
  Region.north,
  Region.south,
  Region.east,
  Region.west,
  Region.central,
];

// ─── Destination image map ─────────────────────────────────────────────────────
function getDestinationImage(destination: string): string {
  const lower = destination.toLowerCase();
  if (
    lower.includes("rajasthan") ||
    lower.includes("jaipur") ||
    lower.includes("jodhpur") ||
    lower.includes("udaipur")
  ) {
    return "/assets/generated/dest-rajasthan.dim_600x400.jpg";
  }
  if (
    lower.includes("kerala") ||
    lower.includes("alleppey") ||
    lower.includes("kochi") ||
    lower.includes("munnar")
  ) {
    return "/assets/generated/dest-kerala.dim_600x400.jpg";
  }
  if (
    lower.includes("ladakh") ||
    lower.includes("leh") ||
    lower.includes("himalaya")
  ) {
    return "/assets/generated/dest-ladakh.dim_600x400.jpg";
  }
  // Rotate between available images based on hash
  const hash = destination.charCodeAt(0) % 3;
  const imgs = [
    "/assets/generated/dest-rajasthan.dim_600x400.jpg",
    "/assets/generated/dest-kerala.dim_600x400.jpg",
    "/assets/generated/dest-ladakh.dim_600x400.jpg",
  ];
  return imgs[hash];
}

// ─── Format price ─────────────────────────────────────────────────────────────
function formatPrice(price: bigint): string {
  const num = Number(price);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

// ─── Smooth scroll helper ──────────────────────────────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

// ─── TESTIMONIALS DATA ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Ramesh Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Rajasthan tour was absolutely magical. RK Tours handled everything perfectly — from desert safaris to palace visits. Every detail was thoughtfully planned!",
    initials: "RS",
  },
  {
    name: "Priya Nair",
    location: "Bangalore",
    rating: 5,
    text: "Kerala backwaters experience was a dream come true. The houseboat stay, the spice tours, the serene sunsets — Highly recommend RK Tours for anyone visiting God's own country!",
    initials: "PN",
  },
  {
    name: "Aditya Kapoor",
    location: "Delhi",
    rating: 5,
    text: "Ladakh trip was thrilling and incredibly well-organized. The team handled permits, accommodation, and altitude acclimatization seamlessly. Best travel agency in India!",
    initials: "AK",
  },
];

// ─── WHY US DATA ───────────────────────────────────────────────────────────────
const WHY_US_FEATURES = [
  {
    icon: <Users className="w-7 h-7" />,
    title: "Expert Local Guides",
    desc: "Experienced guides who know every hidden corner of India — from the Himalayas to the backwaters.",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Best Price Guarantee",
    desc: "Competitive prices with absolutely no hidden costs. What you see is exactly what you pay.",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "All India Coverage",
    desc: "Curated tours covering all 28 states and 8 Union Territories — every corner of incredible India.",
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    title: "24/7 Support",
    desc: "Round-the-clock assistance throughout your journey. We're always just a call away.",
  },
];

// ─── Package Card ──────────────────────────────────────────────────────────────
function PackageCard({
  pkg,
  index,
  onBookTour,
}: {
  pkg: TourPackage;
  index: number;
  onBookTour: (destination: string) => void;
}) {
  const ocidIndex = index + 1;
  return (
    <motion.div
      data-ocid={`packages.item.${ocidIndex}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="bg-card rounded-xl overflow-hidden shadow-card card-hover border border-border flex flex-col"
    >
      {/* Destination image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getDestinationImage(pkg.destination)}
          alt={pkg.destination}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-semibold">{pkg.destination}</span>
        </div>
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 text-xs font-semibold capitalize">
          {pkg.category}
        </Badge>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-card-foreground leading-tight line-clamp-2">
            {pkg.name}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {pkg.duration}
            </span>
            <span className="capitalize flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              {pkg.region} India
            </span>
          </div>
        </div>

        {/* Highlights */}
        {pkg.highlights.length > 0 && (
          <ul className="space-y-1">
            {pkg.highlights.slice(0, 3).map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="flex items-center font-display text-xl font-bold text-primary">
              <IndianRupee className="w-4 h-4" />
              {formatPrice(pkg.price).replace("₹", "")}
              <span className="text-xs text-muted-foreground font-sans font-normal ml-1">
                /person
              </span>
            </p>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-saffron font-semibold"
            onClick={() => onBookTour(pkg.destination)}
          >
            Book Tour
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Package Skeleton ──────────────────────────────────────────────────────────
function PackageSkeleton() {
  return (
    <div
      className="bg-card rounded-xl overflow-hidden border border-border shadow-card"
      data-ocid="packages.loading_state"
    >
      <Skeleton className="h-48 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
        <div className="flex justify-between items-center pt-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("all");
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    destination: string;
    travelDates: string;
    travelers: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDates: "",
    travelers: "2",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { actor } = useActor();
  const regionQuery = usePackagesByRegion(
    selectedRegion === "all" ? null : selectedRegion,
  );
  const packages = regionQuery.data ?? [];
  const isLoading = regionQuery.isLoading;

  const handleBookTour = useCallback((destination: string) => {
    setFormData((prev) => ({ ...prev, destination }));
    scrollTo("contact");
  }, []);

  const handleRegionChange = (region: RegionFilter) => {
    setSelectedRegion(region);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Unable to connect. Please try again.");
      return;
    }
    setIsSubmitting(true);
    try {
      const inquiry: Inquiry = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        travelDates: formData.travelDates,
        travelers: BigInt(formData.travelers || "1"),
        message: formData.message,
      };
      await actor.submitInquiry(inquiry);
      setSubmitSuccess(true);
      toast.success("Thank you! We'll contact you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travelDates: "",
        travelers: "2",
        message: "",
      });
    } catch {
      toast.error(
        "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "home", ocid: "nav.home.link" },
    { label: "Packages", id: "packages", ocid: "nav.packages.link" },
    { label: "Why Us", id: "why-us", ocid: "nav.whyus.link" },
    {
      label: "Testimonials",
      id: "testimonials",
      ocid: "nav.testimonials.link",
    },
    { label: "Contact", id: "contact", ocid: "nav.contact.link" },
  ];

  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster richColors position="top-right" />

      {/* ─── STICKY NAV ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-saffron">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                RK Tours
              </span>
              <span className="block text-xs text-muted-foreground -mt-1">
                & Travels
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid={link.ocid}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </button>
            ))}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-saffron font-semibold ml-2"
              onClick={() => scrollTo("contact")}
            >
              Book Now
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden border-t border-border bg-card"
            >
              <nav className="flex flex-col px-4 py-3 gap-1">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.id}
                    data-ocid={link.ocid}
                    onClick={() => {
                      scrollTo(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  className="mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                  onClick={() => {
                    scrollTo("contact");
                    setMobileMenuOpen(false);
                  }}
                >
                  Book Now
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-[88vh] flex items-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-india.dim_1400x600.jpg')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.68 0.19 51 / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.38 0.09 198 / 0.3) 0%, transparent 50%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10 py-24">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pre-heading badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="mb-5 bg-primary/20 text-white border border-primary/40 text-xs font-semibold uppercase tracking-widest py-1 px-3">
                <MapPin className="w-3 h-3 mr-1.5" />
                All Across India
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore
              <span
                className="block text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, oklch(0.82 0.18 70), oklch(0.76 0.19 55))",
                }}
              >
                Incredible India
              </span>
              with RK Tours
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/85 mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Your trusted travel partner for unforgettable journeys across
              India. From the snow-capped Himalayas to the tropical shores of
              Kerala.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48 }}
            >
              <Button
                size="lg"
                data-ocid="hero.explore_button"
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-saffron font-bold text-base px-8 py-6"
                onClick={() => scrollTo("packages")}
              >
                <Compass className="w-5 h-5 mr-2" />
                Explore Packages
              </Button>
              <Button
                size="lg"
                variant="outline"
                data-ocid="hero.book_button"
                className="border-white/70 text-white hover:bg-white/15 hover:border-white font-bold text-base px-8 py-6 bg-white/10 backdrop-blur-sm"
                onClick={() => scrollTo("contact")}
              >
                Book Now
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              {[
                { val: "500+", label: "Happy Travelers" },
                { val: "50+", label: "Tour Packages" },
                { val: "28", label: "States Covered" },
                { val: "10+", label: "Years Experience" },
              ].map((s) => (
                <div key={s.label} className="text-white">
                  <p
                    className="font-display text-2xl font-bold text-primary"
                    style={{ color: "oklch(0.82 0.18 70)" }}
                  >
                    {s.val}
                  </p>
                  <p className="text-xs text-white/70 font-semibold uppercase tracking-wider mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6 }}
            className="w-0.5 h-8 bg-gradient-to-b from-white/50 to-transparent rounded-full"
          />
        </div>
      </section>

      {/* ─── PACKAGES SECTION ───────────────────────────────────────────────── */}
      <section id="packages" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
              Curated Experiences
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground section-heading-center">
              Tour Packages
            </h2>
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
              Hand-picked journeys across the length and breadth of India,
              designed for every traveler.
            </p>
          </motion.div>

          {/* Region filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {REGION_FILTERS.map((region) => (
              <button
                type="button"
                key={region}
                data-ocid="packages.region.tab"
                onClick={() => handleRegionChange(region)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  selectedRegion === region
                    ? "bg-primary text-primary-foreground border-primary shadow-saffron"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                {REGION_LABELS[region]}
              </button>
            ))}
          </div>

          {/* Package grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((id) => (
                <PackageSkeleton key={id} />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div
              data-ocid="packages.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <MapPin className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-display text-xl font-bold text-muted-foreground">
                No packages found
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Try a different region or check back soon for new packages.
              </p>
            </div>
          ) : (
            <div
              data-ocid="packages.list"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {packages.map((pkg, index) => (
                <PackageCard
                  key={String(pkg.id)}
                  pkg={pkg}
                  index={index}
                  onBookTour={handleBookTour}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section id="why-us" className="py-20 relative overflow-hidden">
        {/* Decorative background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.38 0.09 198) 0%, oklch(0.28 0.07 210) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, oklch(0.68 0.19 51 / 0.5) 0%, transparent 60%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
              Our Promise
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Why Choose Us?
            </h2>
            <div className="w-14 h-0.5 bg-primary mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 flex flex-col items-start gap-4 hover:bg-white/15 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/90 flex items-center justify-center text-white shadow-saffron">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-muted/60">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
              Traveler Stories
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground section-heading-center">
              What Our Travelers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="bg-card rounded-2xl p-7 shadow-card border border-border card-hover flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }, (_, si) => si).map((si) => (
                    <Star
                      key={si}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                <p className="text-card-foreground leading-relaxed text-sm flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-display font-bold text-primary text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-card-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INQUIRY / CONTACT FORM ─────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
              Let's Plan Together
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground section-heading-center">
              Plan Your Dream Trip
            </h2>
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
              Fill in your details and our travel experts will get back to you
              within 24 hours with a personalized itinerary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div
              className="lg:col-span-2 flex flex-col gap-6"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-2xl p-7 border border-border shadow-card space-y-5">
                <h3 className="font-display text-xl font-bold text-card-foreground">
                  Get In Touch
                </h3>
                {[
                  {
                    icon: <Phone className="w-5 h-5" />,
                    label: "Phone",
                    value: "+91 82797 34688",
                  },
                  {
                    icon: <Mail className="w-5 h-5" />,
                    label: "Email",
                    value: "rktoursindia573@gmail.com",
                  },
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    label: "Office",
                    value:
                      "Gurugram, Badshahpur, Bhondsi, Nayagaon, Bhoopsingh Nagar, Gali No. 2",
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    label: "Services",
                    value: "All India Services Available",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm text-card-foreground mt-0.5 leading-snug">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Popular destinations */}
              <div className="bg-card rounded-2xl p-7 border border-border shadow-card">
                <h4 className="font-display text-base font-bold text-card-foreground mb-3">
                  Popular Destinations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Goa",
                    "Kerala",
                    "Rajasthan",
                    "Himachal",
                    "Ladakh",
                    "Varanasi",
                    "Andaman",
                  ].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, destination: d }));
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/15 hover:text-primary border border-border hover:border-primary/40 transition-all font-semibold"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-2xl p-7 border border-border shadow-card">
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      key="success"
                      data-ocid="inquiry.success_state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-card-foreground">
                          Inquiry Sent!
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          Thank you! Our travel experts will contact you within
                          24 hours.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setSubmitSuccess(false)}
                      >
                        Send Another Inquiry
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold"
                          >
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            data-ocid="inquiry.name.input"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="e.g. Rahul Gupta"
                            required
                            className="focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="email"
                            className="text-sm font-semibold"
                          >
                            Email Address{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            data-ocid="inquiry.email.input"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="rahul@example.com"
                            required
                            className="focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-semibold"
                          >
                            Phone Number{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            data-ocid="inquiry.phone.input"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+91 98765 43210"
                            required
                            className="focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="destination"
                            className="text-sm font-semibold"
                          >
                            Destination{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="destination"
                            data-ocid="inquiry.destination.input"
                            value={formData.destination}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                destination: e.target.value,
                              }))
                            }
                            placeholder="e.g. Rajasthan, Kerala"
                            required
                            className="focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="travelDates"
                            className="text-sm font-semibold"
                          >
                            Travel Dates{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="travelDates"
                            data-ocid="inquiry.dates.input"
                            value={formData.travelDates}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                travelDates: e.target.value,
                              }))
                            }
                            placeholder="e.g. 15 Dec – 20 Dec 2026"
                            required
                            className="focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="travelers"
                            className="text-sm font-semibold"
                          >
                            Number of Travelers{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="travelers"
                            type="number"
                            min={1}
                            data-ocid="inquiry.travelers.input"
                            value={formData.travelers}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                travelers: e.target.value,
                              }))
                            }
                            placeholder="2"
                            required
                            className="focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="message"
                          className="text-sm font-semibold"
                        >
                          Special Requirements
                        </Label>
                        <Textarea
                          id="message"
                          data-ocid="inquiry.message.textarea"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Tell us about any dietary requirements, accommodation preferences, activities you'd like..."
                          rows={4}
                          className="focus:ring-primary resize-none"
                        />
                      </div>

                      {isSubmitting && (
                        <div
                          data-ocid="inquiry.loading_state"
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          Sending your inquiry...
                        </div>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        data-ocid="inquiry.submit_button"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-saffron font-bold text-base py-6"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending Inquiry...
                          </>
                        ) : (
                          <>
                            Send Inquiry
                            <ChevronRight className="w-5 h-5 ml-1" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-foreground text-white/80 pt-14 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-saffron">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <span className="font-display font-bold text-lg text-white">
                    RK Tours & Travels
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-sm italic font-display text-lg mb-4">
                "Your Journey, Our Passion"
              </p>
              <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                Creating unforgettable travel memories across India since 2014.
                Trusted by over 500 happy travelers.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", id: "home", ocid: "footer.home.link" },
                  {
                    label: "Packages",
                    id: "packages",
                    ocid: "footer.packages.link",
                  },
                  { label: "Why Us", id: "why-us", ocid: null },
                  {
                    label: "Contact",
                    id: "contact",
                    ocid: "footer.contact.link",
                  },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      data-ocid={link.ocid ?? undefined}
                      onClick={() => scrollTo(link.id)}
                      className="text-sm text-white/60 hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular destinations */}
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
                Popular Destinations
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Goa",
                  "Kerala",
                  "Rajasthan",
                  "Himachal Pradesh",
                  "Ladakh",
                ].map((dest) => (
                  <li key={dest}>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, destination: dest }));
                        scrollTo("contact");
                      }}
                      className="text-sm text-white/60 hover:text-primary transition-colors font-medium flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3" />
                      {dest}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © {currentYear} RK Tours and Travels. All rights reserved.
            </p>
            <p className="text-xs text-white/40">
              Built with <span className="text-primary">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 hover:text-white/80 transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
