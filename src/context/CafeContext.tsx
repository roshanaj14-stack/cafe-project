import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  Reservation,
  ReservationStatus,
  InventoryItem,
  CustomerFeedback,
  LoyaltyProfile,
  SelectedOptions,
  PaymentMethod,
  PickupType,
} from '../types/cafe';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_INVENTORY,
  INITIAL_FEEDBACK,
  INITIAL_LOYALTY,
} from '../data/initialData';

interface CafeContextType {
  // Navigation & Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  customerTab: 'menu' | 'reservations' | 'loyalty' | 'tracker' | 'feedback';
  setCustomerTab: (tab: 'menu' | 'reservations' | 'loyalty' | 'tracker' | 'feedback') => void;
  staffTab: 'kds' | 'inventory' | 'reservations' | 'feedback' | 'analytics';
  setStaffTab: (tab: 'kds' | 'inventory' | 'reservations' | 'feedback' | 'analytics') => void;

  // Cart & Ordering
  menuItems: MenuItem[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedItemForCustomizer: MenuItem | null;
  openCustomizer: (item: MenuItem) => void;
  closeCustomizer: () => void;
  addToCart: (item: MenuItem, options: SelectedOptions, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (details: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentMethod: PaymentMethod;
    pickupType: PickupType;
    tip: number;
    discount?: number;
    scheduledTime?: string;
  }) => Order;

  // Orders & KDS
  orders: Order[];
  activeOrderForTracking: Order | null;
  setActiveOrderForTracking: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  markOrderContactlessPaid: (orderId: string) => void;

  // Contactless Modal
  isContactlessModalOpen: boolean;
  activeContactlessOrder: Order | null;
  openContactlessModal: (order: Order) => void;
  closeContactlessModal: () => void;

  // Reservations
  reservations: Reservation[];
  bookReservation: (data: Omit<Reservation, 'id' | 'referenceCode' | 'status' | 'createdAt'>) => Reservation;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;

  // Inventory
  inventory: InventoryItem[];
  restockInventory: (id: string, quantityToAdd: number) => void;
  toggleMenuItemAvailability: (menuItemId: string) => void;

  // Feedback
  feedbackList: CustomerFeedback[];
  submitFeedback: (data: Omit<CustomerFeedback, 'id' | 'date' | 'status'>) => void;
  replyToFeedback: (id: string, replyText: string) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;

  // Loyalty Program
  loyalty: LoyaltyProfile;
  redeemReward: (rewardId: string) => boolean;
  addLoyaltyStamp: () => void;

  // Sound alert
  playNotificationSound: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

// Helper for synthesized audio chime using Web Audio API
const playCafeChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.05);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  } catch {
    // Graceful fallback if audio context is blocked
  }
};

export const CafeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [customerTab, setCustomerTab] = useState<'menu' | 'reservations' | 'loyalty' | 'tracker' | 'feedback'>('menu');
  const [staffTab, setStaffTab] = useState<'kds' | 'inventory' | 'reservations' | 'feedback' | 'analytics'>('kds');

  const CACHE_VERSION = 'les_amis_v2_en_';

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}menu`);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}orders`);
    const parsed = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    return parsed.length > 0 ? parsed[0] : null;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}reservations`);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}feedback`);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [loyalty, setLoyalty] = useState<LoyaltyProfile>(() => {
    const saved = localStorage.getItem(`${CACHE_VERSION}loyalty`);
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY;
  });

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForCustomizer, setSelectedItemForCustomizer] = useState<MenuItem | null>(null);
  const [isContactlessModalOpen, setIsContactlessModalOpen] = useState(false);
  const [activeContactlessOrder, setActiveContactlessOrder] = useState<Order | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}menu`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}feedback`, JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem(`${CACHE_VERSION}loyalty`, JSON.stringify(loyalty));
  }, [loyalty]);

  // Derived cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.lineTotal, 0);

  const playNotificationSound = () => {
    if (soundEnabled) {
      playCafeChime();
    }
  };

  const openCustomizer = (item: MenuItem) => {
    setSelectedItemForCustomizer(item);
  };

  const closeCustomizer = () => {
    setSelectedItemForCustomizer(null);
  };

  const addToCart = (item: MenuItem, options: SelectedOptions, quantity = 1) => {
    let unitPrice = item.price;
    if (options.extraShot) {
      unitPrice += 0.90;
    }

    const cartEntryId = `${item.id}-${JSON.stringify(options)}`;
    const lineTotal = unitPrice * quantity;

    setCart((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.id === cartEntryId);
      if (existingIdx > -1) {
        const next = [...prev];
        const updatedQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: updatedQty,
          lineTotal: unitPrice * updatedQty,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: cartEntryId,
          menuItem: item,
          quantity,
          selectedOptions: options,
          unitPrice,
          lineTotal,
        },
      ];
    });

    playNotificationSound();
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              lineTotal: item.unitPrice * nextQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = ({
    customerName,
    customerEmail,
    customerPhone,
    paymentMethod,
    pickupType,
    tip,
    discount = 0,
    scheduledTime,
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentMethod: PaymentMethod;
    pickupType: PickupType;
    tip: number;
    discount?: number;
    scheduledTime?: string;
  }): Order => {
    const subtotal = cartSubtotal;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = Math.max(0, Math.round((subtotal + tax + tip - discount) * 100) / 100);
    const orderNumber = `#LA-${Math.floor(100 + Math.random() * 900)}`;
    const pickupCode = `CP-${Math.floor(1000 + Math.random() * 9000)}`;

    const readyMinutes = pickupType === 'asap' ? 12 : 25;
    const estimatedReadyTime = new Date(Date.now() + 1000 * 60 * readyMinutes).toISOString();

    const pointsEarned = Math.round(total * 10);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: customerName || loyalty.name,
      customerEmail: customerEmail || loyalty.email,
      customerPhone: customerPhone || loyalty.phone,
      items: [...cart],
      subtotal,
      tax,
      tip,
      discount,
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'contactless_pickup' ? 'pay_at_pickup' : 'paid_online',
      pickupType,
      scheduledTime,
      createdAt: new Date().toISOString(),
      estimatedReadyTime,
      pickupCode,
      loyaltyPointsEarned: pointsEarned,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderForTracking(newOrder);
    clearCart();

    // Deduct stock count for ordered items
    setMenuItems((prevMenu) =>
      prevMenu.map((mItem) => {
        const orderedItem = cart.find((c) => c.menuItem.id === mItem.id);
        if (orderedItem) {
          const nextStock = Math.max(0, mItem.stockCount - orderedItem.quantity);
          return {
            ...mItem,
            stockCount: nextStock,
            inStock: nextStock > 0,
          };
        }
        return mItem;
      })
    );

    // Update customer loyalty points and stamps
    setLoyalty((prev) => {
      const nextPoints = prev.points + pointsEarned;
      const nextStamps = (prev.stamps + 1) % 8;
      const nextTotalSpent = Math.round((prev.totalSpent + total) * 100) / 100;
      const nextVisits = prev.visitsCount + 1;
      let nextTier = prev.tier;
      if (nextPoints >= 1000) nextTier = 'connoisseur';
      else if (nextPoints >= 400) nextTier = 'regulier';

      return {
        ...prev,
        points: nextPoints,
        stamps: nextStamps === 0 ? 8 : nextStamps,
        totalSpent: nextTotalSpent,
        visitsCount: nextVisits,
        tier: nextTier,
      };
    });

    playNotificationSound();

    if (paymentMethod === 'contactless_pickup') {
      setActiveContactlessOrder(newOrder);
      setIsContactlessModalOpen(true);
    }

    setCustomerTab('tracker');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (activeOrderForTracking && activeOrderForTracking.id === orderId) {
      setActiveOrderForTracking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    playNotificationSound();
  };

  const markOrderContactlessPaid = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: 'paid_online' } : ord))
    );
    if (activeOrderForTracking && activeOrderForTracking.id === orderId) {
      setActiveOrderForTracking((prev) => (prev ? { ...prev, paymentStatus: 'paid_online' } : null));
    }
  };

  const openContactlessModal = (order: Order) => {
    setActiveContactlessOrder(order);
    setIsContactlessModalOpen(true);
  };

  const closeContactlessModal = () => {
    setIsContactlessModalOpen(false);
  };

  const bookReservation = (
    data: Omit<Reservation, 'id' | 'referenceCode' | 'status' | 'createdAt'>
  ): Reservation => {
    const referenceCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      referenceCode,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newReservation, ...prev]);
    playNotificationSound();
    return newReservation;
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status } : res))
    );
  };

  const restockInventory = (id: string, quantityToAdd: number) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = inv.currentStock + quantityToAdd;
          return {
            ...inv,
            currentStock: updated,
            status: updated <= 0 ? 'out_of_stock' : updated <= inv.minThreshold ? 'low_stock' : 'in_stock',
            lastRestocked: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );
  };

  const toggleMenuItemAvailability = (menuItemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === menuItemId) {
          const nextStockState = !item.inStock;
          return {
            ...item,
            inStock: nextStockState,
            stockCount: nextStockState ? 20 : 0,
          };
        }
        return item;
      })
    );
  };

  const submitFeedback = (data: Omit<CustomerFeedback, 'id' | 'date' | 'status'>) => {
    const newFeedback: CustomerFeedback = {
      ...data,
      id: `feed-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
    playNotificationSound();
    setIsFeedbackModalOpen(false);
  };

  const replyToFeedback = (id: string, replyText: string) => {
    setFeedbackList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'reviewed', reply: replyText } : f))
    );
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = loyalty.availableRewards.find((r) => r.id === rewardId);
    if (!reward || loyalty.points < reward.costPoints) return false;

    setLoyalty((prev) => ({
      ...prev,
      points: prev.points - reward.costPoints,
      availableRewards: prev.availableRewards.map((r) =>
        r.id === rewardId ? { ...r, isRedeemed: true } : r
      ),
    }));
    playNotificationSound();
    return true;
  };

  const addLoyaltyStamp = () => {
    setLoyalty((prev) => {
      const nextStamps = (prev.stamps + 1) % 8;
      return {
        ...prev,
        stamps: nextStamps === 0 ? 8 : nextStamps,
        points: prev.points + 50,
      };
    });
    playNotificationSound();
  };

  return (
    <CafeContext.Provider
      value={{
        userRole,
        setUserRole,
        customerTab,
        setCustomerTab,
        staffTab,
        setStaffTab,
        menuItems,
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        selectedItemForCustomizer,
        openCustomizer,
        closeCustomizer,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        orders,
        activeOrderForTracking,
        setActiveOrderForTracking,
        updateOrderStatus,
        markOrderContactlessPaid,
        isContactlessModalOpen,
        activeContactlessOrder,
        openContactlessModal,
        closeContactlessModal,
        reservations,
        bookReservation,
        updateReservationStatus,
        inventory,
        restockInventory,
        toggleMenuItemAvailability,
        feedbackList,
        submitFeedback,
        replyToFeedback,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        loyalty,
        redeemReward,
        addLoyaltyStamp,
        playNotificationSound,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
