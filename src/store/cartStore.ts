import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartState, OrderType, SelectedOption, Dish } from '@/types';

interface CartStore extends CartState {
  // Actions
  addItem: (dish: Dish, quantity: number, options: SelectedOption[], notes?: string) => void;
  removeItem: (dishId: string, optionsKey: string) => void;
  updateQuantity: (dishId: string, optionsKey: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurantId: (id: string) => void;
  setOrderType: (type: OrderType) => void;
  setPickupTime: (time: Date | undefined) => void;
  setNotes: (notes: string) => void;
  setCustomerInfo: (info: { name: string; phone: string; email: string }) => void;
  
  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  canCheckout: () => boolean;
}

const initialState: CartState = {
  items: [],
  restaurantId: null,
  orderType: 'PICKUP',
  pickupTime: undefined,
  notes: '',
  customerInfo: {
    name: '',
    phone: '',
    email: '',
  },
};

// Helper pour créer une clé unique basée sur le plat + options
const createOptionsKey = (dishId: string, options: SelectedOption[]): string => {
  const optionsHash = options
    .map(o => o.optionId)
    .sort()
    .join('-');
  return `${dishId}-${optionsHash}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (dish, quantity, options, notes) => {
        const { items, restaurantId } = get();
        
        // Si le panier est vide, définir le restaurant
        if (!restaurantId) {
          set({ restaurantId: dish.restaurantId });
        }
        
        // Vérifier si on ajoute du même restaurant
        if (restaurantId && restaurantId !== dish.restaurantId) {
          // Réinitialiser le panier pour le nouveau restaurant
          set({
            items: [],
            restaurantId: dish.restaurantId,
          });
        }

        const optionsKey = createOptionsKey(dish.id, options);
        const existingItemIndex = items.findIndex(
          item => createOptionsKey(item.dishId, item.selectedOptions) === optionsKey
        );

        if (existingItemIndex >= 0) {
          // Mettre à jour la quantité si l'article existe déjà
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          if (notes) newItems[existingItemIndex].notes = notes;
          set({ items: newItems });
        } else {
          // Ajouter nouvel article
          const unitPrice = dish.price + options.reduce((sum, opt) => sum + opt.price, 0);
          const newItem: CartItem = {
            dishId: dish.id,
            dish,
            quantity,
            selectedOptions: options,
            notes,
            unitPrice,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (_dishId, optionsKey) => {
        const { items } = get();
        const newItems = items.filter(
          item => createOptionsKey(item.dishId, item.selectedOptions) !== optionsKey
        );
        set({ items: newItems });
      },

      updateQuantity: (dishId, optionsKey, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(dishId, optionsKey);
          return;
        }
        const newItems = items.map(item => {
          if (createOptionsKey(item.dishId, item.selectedOptions) === optionsKey) {
            return { ...item, quantity };
          }
          return item;
        });
        set({ items: newItems });
      },

      clearCart: () => {
        set({ ...initialState });
      },

      setRestaurantId: (id) => set({ restaurantId: id }),
      setOrderType: (type) => set({ orderType: type }),
      setPickupTime: (time) => set({ pickupTime: time }),
      setNotes: (notes) => set({ notes }),
      setCustomerInfo: (info) => set({ customerInfo: info }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getTotal: () => {
        return get().getSubtotal();
      },

      canCheckout: () => {
        const { items, customerInfo, pickupTime, orderType } = get();
        if (items.length === 0) return false;
        if (!customerInfo.name || !customerInfo.phone) return false;
        if (orderType === 'PICKUP' && !pickupTime) return false;
        return true;
      },
    }),
    {
      name: 'restaurant-cart-storage',
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId,
        orderType: state.orderType,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
