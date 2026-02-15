import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { MenuSection } from '@/components/MenuSection';
import { Footer } from '@/components/Footer';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Skeleton } from '@/components/ui/skeleton';

export function MenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const { restaurant, categories, dishes, openingHours, loading, error } = useRestaurant(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="h-16 bg-neutral-900 border-b border-white/10" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-48 mx-auto mb-8 bg-neutral-800" />
          <Skeleton className="h-96 bg-neutral-800" />
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

  const primaryColor = restaurant.primaryColor || '#F5761A';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Navbar
        restaurantName={restaurant.name}
        restaurantSlug={restaurant.slug}
        primaryColor={primaryColor}
      />

      <main className="flex-1 pt-24 pb-12 relative">
        {/* Background gradient */}
        <div
          className="absolute top-0 inset-x-0 h-96 opacity-10 blur-3xl pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${primaryColor}, transparent)` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
          <h1 className="text-5xl font-bold text-center mb-6 text-white tracking-tight">Notre <span style={{ color: primaryColor }}>Carte</span></h1>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Découvrez nos spécialités préparées avec des ingrédients frais et de qualité.
            Profitez d'une expérience culinaire exceptionnelle.
          </p>
        </div>

        <MenuSection
          categories={categories}
          dishes={dishes}
          primaryColor={primaryColor}
        />
      </main>

      <Footer
        restaurantName={restaurant.name}
        address={restaurant.address}
        phone={restaurant.phone}
        email={restaurant.email}
        openingHours={openingHours}
        primaryColor={primaryColor}
      />
    </div>
  );
}
