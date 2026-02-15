import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ReservationForm } from '@/components/ReservationForm';
import { Footer } from '@/components/Footer';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Users } from 'lucide-react';

export function ReservationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { restaurant, openingHours, loading, error } = useRestaurant(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="h-16 bg-neutral-900 border-b border-white/10" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-48 mx-auto mb-8 bg-neutral-800" />
          <Skeleton className="h-[600px] w-full max-w-2xl mx-auto bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Restaurant non trouvé</h1>
          <p className="text-gray-400">Ce restaurant n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Navbar
        restaurantName={restaurant.name}
        restaurantSlug={restaurant.slug}
        primaryColor={restaurant.primaryColor || '#F5761A'}
      />

      <main className="flex-1 py-16 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: restaurant.primaryColor }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 -scale-x-100" style={{ backgroundColor: restaurant.primaryColor }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white tracking-tight">Réserver une <span style={{ color: restaurant.primaryColor }}>table</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Vivez une expérience gastronomique unique. Réservez votre moment dès maintenant et laissez-nous nous occuper de tout.
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-neutral-900/50 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-neutral-900 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8" style={{ color: restaurant.primaryColor }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Réservation simple</h3>
              <p className="text-gray-400 leading-relaxed">Choisissez votre date et heure préférées en quelques clics</p>
            </div>
            <div className="text-center p-8 bg-neutral-900/50 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-neutral-900 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8" style={{ color: restaurant.primaryColor }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Confirmation rapide</h3>
              <p className="text-gray-400 leading-relaxed">Recevez une confirmation par email instantanément</p>
            </div>
            <div className="text-center p-8 bg-neutral-900/50 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-neutral-900 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8" style={{ color: restaurant.primaryColor }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pour tous groupes</h3>
              <p className="text-gray-400 leading-relaxed">De 1 à 8 personnes ou plus sur demande spéciale</p>
            </div>
          </div>

          {/* Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent blur-3xl opacity-20 pointer-events-none" />
            <ReservationForm
              restaurantId={restaurant.id}
              primaryColor={restaurant.primaryColor || '#F5761A'}
              openingHours={openingHours}
            />
          </div>

        </div>
      </main>

      <Footer
        restaurantName={restaurant.name}
        address={restaurant.address}
        phone={restaurant.phone}
        email={restaurant.email}
        openingHours={openingHours}
        primaryColor={restaurant.primaryColor || '#F5761A'}
      />
    </div>
  );
}
