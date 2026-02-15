import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  restaurantName: string;
  description?: string;
  primaryColor: string;
  restaurantSlug: string;
  isOpen: boolean;
  phone?: string;
  address?: string;
}

export function Hero({
  restaurantName,
  description,
  primaryColor,
  restaurantSlug,
  isOpen,
  phone,
  address
}: HeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black text-white selection:bg-primary/30">

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop"
          alt="Ambiance restaurant"
          className="w-full h-full object-cover opacity-80 animate-in fade-in duration-1000 zoom-in-105 scale-105 origin-center"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text Content */}
          <div className="space-y-10 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-100">

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <div className={cn(
                "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all",
                isOpen
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                <span className={cn("relative flex h-2.5 w-2.5")}>
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isOpen ? "bg-emerald-500" : "bg-red-500"
                  )}></span>
                  <span className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    isOpen ? "bg-emerald-500" : "bg-red-500"
                  )}></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase">
                  {isOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span className="text-xs font-bold tracking-wide text-white">4.9/5 Excellent</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-balance uppercase">
                <span className="block text-white">L'Art de la</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, #fb923c)` }}>
                  Gastronomie
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed font-light">
                {description || 'Une expérience culinaire inoubliable où tradition et modernité se rencontrent pour éveiller vos sens.'}
              </p>
            </div>

            {/* Info Snippets */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-white/10">
              {address && (
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 text-gray-300 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Adresse</p>
                    <p className="text-sm font-medium text-gray-200">{address}</p>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-gray-300 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Réservation</p>
                    <p className="text-sm font-medium text-gray-200">{phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 border-none"
                style={{ backgroundColor: primaryColor }}
                onClick={() => navigate(`/${restaurantSlug}/menu`)}
              >
                Commander
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-bold rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all duration-300 text-white"
                onClick={() => navigate(`/${restaurantSlug}/reservation`)}
              >
                Réserver une table
              </Button>
            </div>
          </div>

          {/* Right: Floating Visual (Mobile hidden or adapted) */}
          <div className="hidden lg:block relative h-full min-h-[600px] w-full animate-in fade-in slide-in-from-right-10 duration-1000 delay-300 perspective-1000">
            {/* Abstract Shapes/Blur */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-screen"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Floating Card Glass */}
            <div className="absolute top-20 right-10 w-80 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500 group cursor-pointer hover:shadow-primary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center border border-white/10 shadow-inner">
                  <Star className="text-yellow-400 fill-yellow-400 h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Plat Signature</h3>
                  <p className="text-xs text-gray-400">Le choix du chef</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 w-full rounded-2xl overflow-hidden relative shadow-lg">
                  <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" alt="Plat" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-sm font-medium text-gray-300">Kebab Gourmet</span>
                  <span className="text-lg font-bold text-white">12.90€</span>
                </div>
              </div>
            </div>

            {/* Secondary CTA Card */}
            <div className="absolute bottom-20 left-10 w-auto p-4 px-6 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500 z-20 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service Rapide</p>
                <h3 className="font-bold text-white text-sm">Prêt en 15 min</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2 text-white/30 hover:text-white/80 transition-colors cursor-pointer">
        <span className="text-[10px] uppercase tracking-[0.2em]">Découvrir</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>

    </section>
  );
}
