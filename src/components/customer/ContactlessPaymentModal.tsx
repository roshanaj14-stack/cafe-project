import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Order } from '../../types/cafe';
import { X, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

interface ContactlessPaymentModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const ContactlessPaymentModal: React.FC<ContactlessPaymentModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  const { markOrderContactlessPaid, setCustomerTab } = useCafe();
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const isAlreadyPaid = order.paymentStatus === 'paid_online' || tapSuccess;

  const handleSimulateTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setTapSuccess(true);
      markOrderContactlessPaid(order.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        {/* Pass Header */}
        <div className="bg-[#2B231B] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#E8E2D9] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E2B778]">
            <Smartphone className="w-4 h-4" />
            <span>Contactless Pickup Pass</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Les Amis · Express Counter
          </h2>
          <div className="flex items-center justify-between text-xs text-[#C7B7A5] mt-2">
            <span>Order {order.orderNumber}</span>
            <span className="font-mono bg-white/15 px-2 py-0.5 rounded text-white">
              Code: {order.pickupCode}
            </span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-6">
          {/* Dynamic QR Code & Barcode Visual Box */}
          <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-[#DDD5C7] flex flex-col items-center justify-center text-center shadow-xs">
            {/* SVG Simulated QR Code */}
            <div className="w-36 h-36 bg-[#FAF8F5] p-2 rounded-xl border border-[#E5DDD0] flex flex-col items-center justify-center relative">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#2B231B]"
                fill="currentColor"
              >
                {/* 4 corner positioning anchors */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#2B231B" />
                <rect x="10" y="10" width="16" height="16" rx="2" fill="#FAF8F5" />
                <rect x="14" y="14" width="8" height="8" fill="#2B231B" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#2B231B" />
                <rect x="74" y="10" width="16" height="16" rx="2" fill="#FAF8F5" />
                <rect x="78" y="14" width="8" height="8" fill="#2B231B" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#2B231B" />
                <rect x="10" y="74" width="16" height="16" rx="2" fill="#FAF8F5" />
                <rect x="14" y="78" width="8" height="8" fill="#2B231B" />

                {/* Inner simulated data dots */}
                <rect x="36" y="8" width="6" height="6" fill="#8C6D46" />
                <rect x="46" y="12" width="6" height="6" fill="#2B231B" />
                <rect x="56" y="8" width="6" height="6" fill="#8C6D46" />
                <rect x="36" y="24" width="6" height="6" fill="#2B231B" />
                <rect x="48" y="32" width="10" height="10" rx="2" fill="#8C6D46" />
                <rect x="12" y="42" width="6" height="6" fill="#2B231B" />
                <rect x="24" y="48" width="6" height="6" fill="#8C6D46" />
                <rect x="38" y="52" width="6" height="6" fill="#2B231B" />
                <rect x="62" y="44" width="6" height="6" fill="#2B231B" />
                <rect x="74" y="54" width="6" height="6" fill="#8C6D46" />
                <rect x="84" y="42" width="6" height="6" fill="#2B231B" />
                <rect x="44" y="70" width="8" height="8" fill="#2B231B" />
                <rect x="58" y="78" width="6" height="6" fill="#8C6D46" />
                <rect x="72" y="72" width="6" height="6" fill="#2B231B" />
                <rect x="82" y="82" width="8" height="8" fill="#8C6D46" />
              </svg>
            </div>

            {/* Simulated Barcode */}
            <div className="mt-3 flex items-center justify-center gap-0.5 h-6">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3].map((w, i) => (
                <div
                  key={i}
                  className="bg-[#2B231B] h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <p className="mt-1 font-mono text-[11px] tracking-widest text-[#8C7A6B]">
              {order.pickupCode} · NFC READY
            </p>
          </div>

          {/* Payment Status & Instructions */}
          <div className="bg-[#F3EDE2] p-4 rounded-xl border border-[#E5DDD0] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B5E52] font-medium">Payment status:</span>
              <span className={`font-semibold ${isAlreadyPaid ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>
                {isAlreadyPaid ? '✓ Contactless Verified / Paid' : 'Tap Phone or Card at Counter Reader'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B5E52]">Total amount:</span>
              <span className="font-mono font-bold text-sm text-[#2B231B] tabular-nums">
                €{order.total.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-[#7A6D60] pt-1 border-t border-[#E8E2D9]">
              Present this pass at the <strong className="text-[#2B231B]">Comptoir Express Station</strong> (Barista Counter). Hold your phone near the contactless sensor to verify and collect instantly.
            </p>
          </div>

          {/* Interactive Tap Simulator */}
          <div className="space-y-2">
            {!isAlreadyPaid ? (
              <button
                type="button"
                onClick={handleSimulateTap}
                disabled={isTapping}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#8C6D46] hover:bg-[#735836] transition-colors cursor-pointer shadow-xs"
              >
                <Smartphone className={`w-4 h-4 ${isTapping ? 'animate-bounce' : ''}`} />
                <span>
                  {isTapping ? 'Connecting with Counter Reader...' : 'Simulate Contactless Tap at Counter'}
                </span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Contactless Verification Complete</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                setCustomerTab('tracker');
              }}
              className="w-full py-2.5 text-xs font-medium text-[#5C5248] hover:text-[#2B231B] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Track Live Preparation in Real-Time</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
