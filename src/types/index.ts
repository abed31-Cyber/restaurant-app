// Types globaux pour l'application Restaurant SaaS

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  primaryColor?: string;
  description?: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  restaurantId?: string;
  createdAt: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'KITCHEN' | 'CLIENT';

export interface OpeningHours {
  id: string;
  restaurantId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  restaurantId: string;
  dishes: Dish[];
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  allergens: string[];
  categoryId: string;
  restaurantId: string;
  sortOrder: number;
  options: DishOption[];
  category?: Category;
}

export interface DishOption {
  id: string;
  dishId: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

// Panier / Commande
export interface CartItem {
  dishId: string;
  dish: Dish;
  quantity: number;
  selectedOptions: SelectedOption[];
  notes?: string;
  unitPrice: number;
}

export interface SelectedOption {
  optionId: string;
  name: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  orderType: OrderType;
  pickupTime?: Date;
  notes?: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export type OrderType = 'PICKUP' | 'DELIVERY' | 'DINE_IN';

export interface Order {
  id: string;
  restaurantId: string;
  userId?: string;
  status: OrderStatus;
  type: OrderType;
  totalPrice: number;
  subtotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pickupTime?: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'ONLINE' | 'CASH' | 'CARD_ON_SITE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  options?: SelectedOption[];
  notes?: string;
  dish: Dish;
}

// Réservations
export interface Reservation {
  id: string;
  restaurantId: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
  tableNumber?: string;
  createdAt: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

// Avis
export interface Review {
  id: string;
  restaurantId: string;
  name: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  todayReservations: number;
  weeklyRevenue: number;
  weeklyOrders: number;
  popularDishes: {
    dishId: string;
    name: string;
    count: number;
  }[];
}
