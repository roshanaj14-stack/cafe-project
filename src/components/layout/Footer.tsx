import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { MapPin, Clock, Phone, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const { setCustomerTab, openStaffLoginModal, staffSession } = useCafe();

  return (
    <footer className="bg-[#2B231B] text-[#C7B7A5] border-t border-[#43372B] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#3D3227]">
          {/* Brand & Concept */}
          <div className="space-y-3">
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
              Les Amis
            </h3>
            <p className="text-xs text-[#A39486] leading-relaxed">
              Specialty coffee & artisanal bakery in Saint-Germain-des-Prés. Pure butter laminated pastries baked hourly and double-origin micro-lots roasted to perfection.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#E2B778]">
              <span>★ 4.9 Rated on Google & Tripadvisor</span>
            </div>
            {onReplayIntro && !staffSession && (
              <button
                onClick={onReplayIntro}
                className="text-[11px] font-mono uppercase text-[#E2B778] hover:underline cursor-pointer block mt-1"
              >
                ▶ Replay Cinematic Intro
              </button>
            )}
          </div>

          {/* Location & Hours */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#E2B778] font-bold">
              Hours & Location
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E2B778] shrink-0 mt-0.5" />
              <span>18 Rue de l’Ancienne Comédie, 75006 Paris</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-[#E2B778] shrink-0 mt-0.5" />
              <span>Monday to Sunday: 7:30 AM — 7:00 PM</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-[#E2B778] shrink-0 mt-0.5" />
              <span>+33 1 43 26 02 80</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#E2B778] font-bold">
              Guest Experience
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Seasonal Menu & Online Ordering
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('reservations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Table Reservations & Terrace
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('loyalty');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Les Amis Club (Stamps & Rewards)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('tracker');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contactless Pickup Pass & Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Staff Access Control (Protected by Login) */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#E2B778] font-bold">
              Staff & Operations (Protected)
            </h4>
            <p className="text-[#A39486]">
              Secure login required. Customer access to back-office kitchen queues and financial reports is strictly restricted.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => openStaffLoginModal('barista')}
                className="text-left text-[#E2B778] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Barista Station Sign In</span>
              </button>
              <button
                onClick={() => openStaffLoginModal('manager')}
                className="text-left text-[#E2B778] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manager & Admin Sign In</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7A6B] gap-2">
          <span>© 2026 Les Amis Café & Bakery. All rights reserved.</span>
          <span>Role-Based Access Control · Protected Staff Operations</span>
        </div>
      </div>
    </footer>
  );
};
