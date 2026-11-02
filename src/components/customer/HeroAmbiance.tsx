import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { Coffee, Calendar, Sparkles, MapPin, Clock } from 'lucide-react';

export const HeroAmbiance: React.FC = () => {
  const { setCustomerTab } = useCafe();

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-4 pb-12 sm:pb-16 border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial & Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-[#8C6D46] tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Saint-Germain-des-Prés · Paris 6e</span>
              <span className="text-[#C4B5A2]">·</span>
              <Clock className="w-3.5 h-3.5" />
              <span>Open Daily 7:30 AM — 7:00 PM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2B231B] leading-[1.08] tracking-tight">
              The Art of Coffee & Pure Butter <span className="italic font-normal text-[#8C6D46]">Viennoiserie</span>
            </h1>

            <p className="text-base sm:text-lg text-[#665A4F] max-w-xl font-normal leading-relaxed">
              Step into an intimate Parisian sanctuary where single-origin micro-lot espressos meet crisp 72-layer laminated butter croissants. Order ahead with instant contactless pickup or reserve a sunlit street terrace table.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCustomerTab('menu')}
                className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#2B231B] hover:bg-[#43372B] rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer active:scale-95"
              >
                <Coffee className="w-4 h-4 text-[#E2B778]" />
                <span>Order for Pickup</span>
              </button>

              <button
                onClick={() => setCustomerTab('reservations')}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-[#2B231B] bg-[#EFE9DF] hover:bg-[#E3DACB] rounded-xl transition-colors whitespace-nowrap cursor-pointer border border-[#DDD5C7]"
              >
                <Calendar className="w-4 h-4 text-[#8C6D46]" />
                <span>Reserve a Table</span>
              </button>

              <button
                onClick={() => setCustomerTab('loyalty')}
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-[#8C6D46] hover:text-[#5E482D] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C4975C]" />
                <span>Loyalty Club</span>
              </button>
            </div>

            {/* Proof Strip */}
            <div className="pt-4 border-t border-[#ECE5DC] grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xs text-[#8C7A6B]">Espresso</p>
                <p className="text-sm font-serif font-bold text-[#2B231B]">Double Origin</p>
                <p className="text-[11px] text-[#A39486]">Roasted in Paris</p>
              </div>
              <div>
                <p className="text-xs text-[#8C7A6B]">Pastry</p>
                <p className="text-sm font-serif font-bold text-[#2B231B]">AOP Charentes Butter</p>
                <p className="text-[11px] text-[#A39486]">Baked Every 45 Mins</p>
              </div>
              <div>
                <p className="text-xs text-[#8C7A6B]">Pickup</p>
                <p className="text-sm font-serif font-bold text-[#2B231B]">Contactless Tap</p>
                <p className="text-[11px] text-[#A39486]">NFC & QR at Bar</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E3DACB] bg-[#E8E0D5] aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
              <img
                src="/src/assets/images/hero_cafe_ambiance_1793590490472.jpg"
                alt="Les Amis cafe interior with marble tables, brass chandeliers and sunlit terrace"
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
              
              {/* Bottom Scrim Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D46]">
                    Bakery & Espresso Bar
                  </p>
                  <p className="text-xs font-semibold text-[#2B231B]">
                    Fresh batch of viennoiseries ready
                  </p>
                </div>
                <button
                  onClick={() => setCustomerTab('menu')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#2B231B] rounded-lg hover:bg-[#43372B] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
