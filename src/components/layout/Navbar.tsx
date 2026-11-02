import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { ShoppingBag, ShieldCheck, Lock, LogOut, Clock, Sparkles, Play, User } from 'lucide-react';

interface NavbarProps {
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro }) => {
  const {
    userRole,
    staffSession,
    openStaffLoginModal,
    logoutStaff,
    customerTab,
    setCustomerTab,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
  } = useCafe();

  const isStaffAuthenticated = !!staffSession?.isAuthenticated;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isStaffAuthenticated) {
                  // Keep on staff dashboard if logged in, or switch tabs
                } else {
                  setCustomerTab('menu');
                }
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2B231B] group-hover:text-[#8C6D46] transition-colors whitespace-nowrap shrink-0 block">
                Les Amis
              </span>
              <span className="text-[11px] font-sans tracking-widest uppercase text-[#8C7A6B] block -mt-1">
                Artisanal Parisian Café & Bakery
              </span>
            </button>

            {onReplayIntro && !isStaffAuthenticated && (
              <button
                onClick={onReplayIntro}
                className="hidden lg:flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase text-[#8C7A6B] hover:text-[#2B231B] bg-[#EFE9DF] hover:bg-[#E4DCCE] rounded-md transition-colors cursor-pointer"
                title="Replay cinematic intro animation"
              >
                <Play className="w-2.5 h-2.5 text-[#8C6D46]" />
                <span>Intro</span>
              </button>
            )}
          </div>

          {/* Zone 2: Navigation Links (single-line, clean typography) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5248]">
            {!isStaffAuthenticated ? (
              <>
                <button
                  onClick={() => setCustomerTab('menu')}
                  className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                    customerTab === 'menu'
                      ? 'text-[#2B231B] border-[#8C6D46] font-semibold'
                      : 'border-transparent hover:text-[#2B231B]'
                  }`}
                >
                  Menu & Order
                </button>
                <button
                  onClick={() => setCustomerTab('reservations')}
                  className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                    customerTab === 'reservations'
                      ? 'text-[#2B231B] border-[#8C6D46] font-semibold'
                      : 'border-transparent hover:text-[#2B231B]'
                  }`}
                >
                  Table Reservations
                </button>
                <button
                  onClick={() => setCustomerTab('loyalty')}
                  className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 flex items-center gap-1.5 ${
                    customerTab === 'loyalty'
                      ? 'text-[#2B231B] border-[#8C6D46] font-semibold'
                      : 'border-transparent hover:text-[#2B231B]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C4975C]" />
                  <span>Loyalty Club</span>
                </button>
                <button
                  onClick={() => setCustomerTab('tracker')}
                  className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 flex items-center gap-1.5 ${
                    customerTab === 'tracker'
                      ? 'text-[#2B231B] border-[#8C6D46] font-semibold'
                      : 'border-transparent hover:text-[#2B231B]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span>Track Order</span>
                </button>
                <button
                  onClick={() => setCustomerTab('feedback')}
                  className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                    customerTab === 'feedback'
                      ? 'text-[#2B231B] border-[#8C6D46] font-semibold'
                      : 'border-transparent hover:text-[#2B231B]'
                  }`}
                >
                  Guest Reviews
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C6D46] bg-[#F3EDE2] px-3.5 py-1.5 rounded-lg border border-[#E2D8CC]">
                <ShieldCheck className="w-4 h-4 text-[#8C6D46]" />
                <span className="font-semibold">
                  {staffSession.staffName}
                </span>
                <span className="text-[#8C7A6B]">·</span>
                <span className="text-[#2B231B]">
                  {staffSession.role === 'manager' ? 'Admin / Manager' : 'Barista Station'}
                </span>
              </div>
            )}
          </nav>

          {/* Zone 3: Primary Action & Authentication State */}
          <div className="flex items-center gap-3 shrink-0">
            {!isStaffAuthenticated ? (
              <>
                {/* Discreet Staff Sign-In trigger for employees only */}
                <button
                  onClick={() => openStaffLoginModal()}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B5E52] hover:text-[#2B231B] bg-[#EFE9DF] hover:bg-[#E4DCCE] rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-[#DDD5C7]"
                  title="Staff Login (Barista & Manager)"
                >
                  <Lock className="w-3.5 h-3.5 text-[#8C6D46]" />
                  <span className="hidden sm:inline">Staff Sign In</span>
                </button>

                {/* Customer Shopping Bag */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-white bg-[#2B231B] hover:bg-[#43372B] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="font-medium">Cart</span>
                  {cartCount > 0 && (
                    <span className="flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-[#2B231B] bg-[#E2B778] rounded-full tabular-nums">
                      {cartCount}
                    </span>
                  )}
                  <span className="hidden sm:inline font-mono tabular-nums text-[#D8C7B5] border-l border-[#43372B] pl-2">
                    €{cartSubtotal.toFixed(2)}
                  </span>
                </button>
              </>
            ) : (
              /* Authenticated Staff Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={logoutStaff}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#2B231B] hover:bg-[#43372B] rounded-lg shadow-xs transition-colors cursor-pointer"
                  title="Log out and return to customer storefront"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#E2B778]" />
                  <span>Lock / Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row for Customers */}
        {!isStaffAuthenticated && (
          <div className="md:hidden flex items-center justify-around py-2.5 border-t border-[#ECE5DC] text-xs font-medium text-[#5C5248]">
            <button
              onClick={() => setCustomerTab('menu')}
              className={`flex items-center gap-1 py-1 ${
                customerTab === 'menu' ? 'text-[#8C6D46] font-semibold' : ''
              }`}
            >
              <span>Menu</span>
            </button>
            <button
              onClick={() => setCustomerTab('reservations')}
              className={`flex items-center gap-1 py-1 ${
                customerTab === 'reservations' ? 'text-[#8C6D46] font-semibold' : ''
              }`}
            >
              <span>Reserve</span>
            </button>
            <button
              onClick={() => setCustomerTab('loyalty')}
              className={`flex items-center gap-1 py-1 ${
                customerTab === 'loyalty' ? 'text-[#8C6D46] font-semibold' : ''
              }`}
            >
              <span>Loyalty</span>
            </button>
            <button
              onClick={() => setCustomerTab('tracker')}
              className={`flex items-center gap-1 py-1 ${
                customerTab === 'tracker' ? 'text-[#8C6D46] font-semibold' : ''
              }`}
            >
              <span>Tracker</span>
            </button>
            <button
              onClick={() => openStaffLoginModal()}
              className="flex items-center gap-1 py-1 text-[#8C6D46]"
            >
              <Lock className="w-3 h-3" />
              <span>Staff</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
