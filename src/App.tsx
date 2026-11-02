/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Navbar } from './components/layout/Navbar';
import { HeroAmbiance } from './components/customer/HeroAmbiance';
import { MenuSection } from './components/customer/MenuSection';
import { ReservationView } from './components/customer/ReservationView';
import { LoyaltyView } from './components/customer/LoyaltyView';
import { OrderTrackerView } from './components/customer/OrderTrackerView';
import { FeedbackView } from './components/customer/FeedbackView';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { CartDrawer } from './components/customer/CartDrawer';
import { ItemCustomizerModal } from './components/customer/ItemCustomizerModal';
import { ContactlessPaymentModal } from './components/customer/ContactlessPaymentModal';
import { FeedbackModal } from './components/customer/FeedbackModal';
import { StaffLoginModal } from './components/layout/StaffLoginModal';
import { Footer } from './components/layout/Footer';
import { FlashIntro } from './components/common/FlashIntro';

const CafeMainContent: React.FC<{ onReplayIntro: () => void }> = ({ onReplayIntro }) => {
  const {
    userRole,
    customerTab,
    isContactlessModalOpen,
    activeContactlessOrder,
    closeContactlessModal,
  } = useCafe();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B231B] selection:bg-[#E2B778]/30">
      {/* Top Navbar */}
      <Navbar onReplayIntro={onReplayIntro} />

      {/* Main View Area */}
      <main className="flex-1">
        {userRole === 'customer' ? (
          <div>
            {customerTab === 'menu' && (
              <>
                <HeroAmbiance />
                <MenuSection />
              </>
            )}

            {customerTab === 'reservations' && <ReservationView />}

            {customerTab === 'loyalty' && <LoyaltyView />}

            {customerTab === 'tracker' && <OrderTrackerView />}

            {customerTab === 'feedback' && <FeedbackView />}
          </div>
        ) : (
          <StaffDashboard />
        )}
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <ItemCustomizerModal />
      <ContactlessPaymentModal
        isOpen={isContactlessModalOpen}
        order={activeContactlessOrder}
        onClose={closeContactlessModal}
      />
      <FeedbackModal />
      <StaffLoginModal />

      {/* Footer */}
      <Footer onReplayIntro={onReplayIntro} />
    </div>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // Show intro on initial application start
    return true;
  });

  return (
    <CafeProvider>
      {showIntro && <FlashIntro onComplete={() => setShowIntro(false)} />}
      <CafeMainContent onReplayIntro={() => setShowIntro(true)} />
    </CafeProvider>
  );
}
