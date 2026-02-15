import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { MenuSection } from '@/components/MenuSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Skeleton } from '@/components/ui/skeleton';

export function HomePage() {
  const { slug } = useParams<{ slug: string }>();
  const { restaurant, categories, dishes, openingHours, loading, error, isOpen } = useRestaurant(slug || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col pt-16">
        <div className="max-w-7xl mx-auto px-4 w-full space-y-8">
          <Skeleton className="h-[400px] w-full rounded-xl bg-neutral-900" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3 bg-neutral-900" />
            <Skeleton className="h-64 w-full bg-neutral-900" />
          </div>
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
          <p className="text-red-400 text-sm mt-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Navbar
        restaurantName={restaurant.name}
        restaurantSlug={restaurant.slug}
        primaryColor={restaurant.primaryColor || '#F97316'}
      />

      <main className="flex-1">
        <Hero
          restaurantName={restaurant.name}
          description={restaurant.description || undefined}
          primaryColor={restaurant.primaryColor || '#F97316'}
          restaurantSlug={restaurant.slug}
          isOpen={isOpen}
          phone={restaurant.phone}
          address={restaurant.address}
        />

        <MenuSection
          categories={categories}
          dishes={dishes}
          primaryColor={restaurant.primaryColor || '#F97316'}
        />

        <ReviewsSection
          reviews={[]}
          restaurantId={restaurant.id}
          primaryColor={restaurant.primaryColor || '#F97316'}
        />
      </main>

      <Footer
        restaurantName={restaurant.name}
        address={restaurant.address}
        phone={restaurant.phone}
        email={restaurant.email}
        openingHours={openingHours}
        primaryColor={restaurant.primaryColor || '#F97316'}
      />
    </div>
  );
}
