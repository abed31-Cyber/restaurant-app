import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Restaurant, Category, Dish, OpeningHours } from '@/types';

export function useRestaurant(slug: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchRestaurant();
    }
  }, [slug]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('Restaurant')
        .select('*')
        .eq('slug', slug)
        .single();

      if (restaurantError) throw restaurantError;
      if (!restaurantData) throw new Error('Restaurant not found');

      setRestaurant(restaurantData as Restaurant);
      const restaurantId = (restaurantData as Restaurant).id;

      // Fetch categories with dishes
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('Category')
        .select(`
          *,
          dishes:Dish(*, options:DishOption(*))
        `)
        .eq('restaurantId', restaurantId)
        .order('sortOrder');

      if (categoriesError) throw categoriesError;
      setCategories((categoriesData as Category[]) || []);

      // Fetch all dishes
      const { data: dishesData, error: dishesError } = await supabase
        .from('Dish')
        .select(`
          *,
          options:DishOption(*),
          category:Category(name)
        `)
        .eq('restaurantId', restaurantId)
        .eq('isAvailable', true)
        .order('sortOrder');

      if (dishesError) throw dishesError;
      setDishes((dishesData as Dish[]) || []);

      // Fetch opening hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('OpeningHours')
        .select('*')
        .eq('restaurantId', restaurantId)
        .order('dayOfWeek');

      if (hoursError) throw hoursError;
      setOpeningHours((hoursData as OpeningHours[]) || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isOpen = () => {
    if (openingHours.length === 0) return false;
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const todayHours = openingHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!todayHours || todayHours.isClosed) return false;
    
    return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
  };

  return {
    restaurant,
    categories,
    dishes,
    openingHours,
    loading,
    error,
    isOpen: isOpen(),
    refetch: fetchRestaurant,
  };
}
