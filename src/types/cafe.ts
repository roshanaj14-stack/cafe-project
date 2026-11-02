export type UserRole = 'customer' | 'barista' | 'manager';

export type MenuCategory = 'coffee' | 'viennoiserie' | 'brunch' | 'desserts' | 'tea';

export interface MenuItem {
  id: string;
  name: string;
  frenchName: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  tags: string[];
  prepTimeMinutes: number;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  customizationOptions?: {
    milk?: string[];
    sweetness?: string[];
    temperature?: string[];
    extraShots?: boolean;
    warming?: boolean;
    specialInstructions?: string;
  };
}

export interface SelectedOptions {
  milk?: string;
  sweetness?: string;
  temperature?: string;
  extraShot?: boolean;
  warming?: boolean;
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOptions;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus = 'pending' | 'brewing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'contactless_pickup' | 'apple_pay' | 'google_pay' | 'card_online';
export type PaymentStatus = 'paid_online' | 'pay_at_pickup';
export type PickupType = 'asap' | 'scheduled' | 'dine_in';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pickupType: PickupType;
  scheduledTime?: string;
  createdAt: string;
  estimatedReadyTime: string;
  pickupCode: string;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed?: number;
}

export type SeatingArea = 'terrace' | 'velvet_booth' | 'coffee_bar' | 'winter_garden';
export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  referenceCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  seatingArea: SeatingArea;
  specialNotes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'coffee_beans' | 'dairy_alternatives' | 'bakery_ingredients' | 'syrups' | 'packaging';
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CustomerFeedback {
  id: string;
  customerName: string;
  email: string;
  rating: number; // 1-5
  category: 'coffee_food' | 'service' | 'ambiance' | 'pickup_speed';
  comment: string;
  date: string;
  orderNumber?: string;
  status: 'new' | 'reviewed' | 'resolved';
  reply?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  costPoints: number;
  description: string;
  code: string;
  isRedeemed?: boolean;
}

export interface LoyaltyProfile {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: 'flaneur' | 'regulier' | 'connoisseur';
  stamps: number; // out of 8 for free beverage
  totalSpent: number;
  visitsCount: number;
  memberSince: string;
  availableRewards: LoyaltyReward[];
}
