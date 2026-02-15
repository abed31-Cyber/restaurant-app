// Types Supabase Database (généré automatiquement par Prisma)
export type Database = {
  public: {
    Tables: {
      Restaurant: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string;
          phone: string;
          email: string;
          logoUrl: string | null;
          primaryColor: string | null;
          description: string | null;
          subscriptionStatus: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address: string;
          phone: string;
          email: string;
          logoUrl?: string | null;
          primaryColor?: string | null;
          description?: string | null;
          subscriptionStatus?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          address?: string;
          phone?: string;
          email?: string;
          logoUrl?: string | null;
          primaryColor?: string | null;
          description?: string | null;
          subscriptionStatus?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      User: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string | null;
          role: string;
          restaurantId: string | null;
          emailVerified: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      Category: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sortOrder: number;
          restaurantId: string;
        };
      };
      Dish: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          imageUrl: string | null;
          isAvailable: boolean;
          isSpicy: boolean;
          isVegetarian: boolean;
          allergens: string[];
          categoryId: string;
          restaurantId: string;
          sortOrder: number;
          createdAt: string;
          updatedAt: string;
        };
      };
      DishOption: {
        Row: {
          id: string;
          dishId: string;
          name: string;
          price: number;
          isAvailable: boolean;
        };
      };
      Order: {
        Row: {
          id: string;
          restaurantId: string;
          userId: string | null;
          status: string;
          type: string;
          totalPrice: number;
          subtotal: number;
          paymentMethod: string;
          paymentStatus: string;
          stripePaymentIntentId: string | null;
          pickupTime: string | null;
          notes: string | null;
          customerName: string | null;
          customerPhone: string | null;
          customerEmail: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      OrderItem: {
        Row: {
          id: string;
          orderId: string;
          dishId: string;
          quantity: number;
          unitPrice: number;
          options: any;
          notes: string | null;
        };
      };
      Reservation: {
        Row: {
          id: string;
          restaurantId: string;
          userId: string | null;
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          status: string;
          notes: string | null;
          tableNumber: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      Review: {
        Row: {
          id: string;
          restaurantId: string;
          orderId: string | null;
          name: string;
          rating: number;
          comment: string | null;
          isApproved: boolean;
          createdAt: string;
        };
      };
      OpeningHours: {
        Row: {
          id: string;
          restaurantId: string;
          dayOfWeek: number;
          openTime: string;
          closeTime: string;
          isClosed: boolean;
        };
      };
    };
  };
};
