import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Order, OrderStatus } from '../../types/cafe';
import { Clock, Smartphone, MessageSquare } from 'lucide-react';

export const OrderTrackerView: React.FC = () => {
  const {
    orders,
    activeOrderForTracking,
    setActiveOrderForTracking,
    openContactlessModal,
    setIsFeedbackModalOpen,
  } = useCafe();

  const [activeOrder, setActiveOrder] = useState<Order | null>(activeOrderForTracking || (orders.length > 0 ? orders[0] : null));
  const [remainingSeconds, setRemainingSeconds] = useState(380);

  useEffect(() => {
    if (activeOrderForTracking) {
      setActiveOrder(activeOrderForTracking);
    } else if (orders.length > 0 && !activeOrder) {
      setActiveOrder(orders[0]);
    }
  }, [activeOrderForTracking, orders]);

  // Simulated countdown for pending or brewing orders
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'ready' || activeOrder.status === 'completed') {
      return;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#8C6D46] mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2B231B]">
          No Active Orders Found
        </h2>
        <p className="text-sm text-[#8C7A6B] mt-1">
          When you place a coffee or pastry order, you can follow its live preparation and retrieve your contactless pickup pass here.
        </p>
      </div>
    );
  }

  const steps: Array<{ status: OrderStatus; title: string; subtitle: string; icon: string }> = [
    {
      status: 'pending',
      title: 'Order Confirmed',
      subtitle: 'Received by barista team',
      icon: '✓',
    },
    {
      status: 'brewing',
      title: 'In Preparation',
      subtitle: 'Espresso extraction & oven warming',
      icon: '☕',
    },
    {
      status: 'ready',
      title: 'Ready at Counter',
      subtitle: 'Express Pickup Station #1',
      icon: '✨',
    },
    {
      status: 'completed',
      title: 'Picked Up & Served',
      subtitle: 'Enjoy your coffee & pastries!',
      icon: '★',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'brewing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(activeOrder.status);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6">
      {/* View Header with Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D46] block">
            Real-Time Order Tracking
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#2B231B] mt-0.5">
            Order Status {activeOrder.orderNumber}
          </h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Placed at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Pickup Code: <strong className="font-mono text-[#2B231B]">{activeOrder.pickupCode}</strong>
          </p>
        </div>

        {/* Switcher if multiple orders exist */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8C7A6B]">My orders:</span>
            <select
              value={activeOrder.id}
              onChange={(e) => {
                const found = orders.find((o) => o.id === e.target.value);
                if (found) {
                  setActiveOrder(found);
                  setActiveOrderForTracking(found);
                }
              }}
              className="text-xs p-2 rounded-lg border border-[#DDD5C7] bg-white text-[#2B231B] font-mono cursor-pointer capitalize"
            >
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.orderNumber} ({ord.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Tracker Card */}
      <div className="mt-8 bg-white border border-[#E5DDD0] rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Estimated Status Banner */}
        <div className="p-6 rounded-2xl bg-[#F4EDE2] border border-[#E2D8CC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C6D46] block">
              Preparation Stage
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B231B] mt-1">
              {activeOrder.status === 'ready'
                ? 'Your order is ready at the counter!'
                : activeOrder.status === 'brewing'
                ? 'Barista is crafting your coffee & pastries'
                : activeOrder.status === 'completed'
                ? 'Order completed. Enjoy your visit!'
                : 'Order received and sent to barista station'}
            </h3>
            <p className="text-xs text-[#665A4F] mt-1">
              Station: <strong className="text-[#2B231B]">Comptoir Express N°1</strong> · Lead Barista: Julien
            </p>
          </div>

          {/* Countdown timer */}
          {activeOrder.status !== 'ready' && activeOrder.status !== 'completed' && (
            <div className="bg-white px-5 py-4 rounded-xl border border-[#DDD5C7] text-center shrink-0 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-[#8C7A6B] block">
                Estimated Time
              </span>
              <span className="font-mono text-2xl font-bold text-[#2B231B] tabular-nums block mt-0.5">
                {formatTime(remainingSeconds)}
              </span>
              <span className="text-[10px] text-[#16A34A] font-semibold">
                ● Live Update
              </span>
            </div>
          )}
        </div>

        {/* Live Stepper Visualization */}
        <div className="mt-10 py-4">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-[#ECE5DC] -z-0">
              <div
                className="h-full bg-[#8C6D46] transition-all duration-700"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stepper items */}
            <div className="grid grid-cols-4 relative z-10 text-center">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st.status} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#2B231B] text-white ring-4 ring-[#8C6D46]/20 scale-110 shadow-sm'
                          : isPassed
                          ? 'bg-[#8C6D46] text-white'
                          : 'bg-white border-2 border-[#DDD5C7] text-[#A39486]'
                      }`}
                    >
                      {st.icon}
                    </div>

                    <h4
                      className={`mt-3 text-xs sm:text-sm font-semibold leading-tight ${
                        isPassed ? 'text-[#2B231B]' : 'text-[#A39486]'
                      }`}
                    >
                      {st.title}
                    </h4>

                    <p className="text-[11px] text-[#8C7A6B] hidden sm:block mt-0.5">
                      {st.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contactless Pickup Action Box */}
        <div className="mt-10 p-5 rounded-2xl border border-[#E5DDD0] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#2B231B] text-[#E2B778] shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2B231B]">
                Contactless Digital Pass & Pickup
              </h4>
              <p className="text-xs text-[#665A4F]">
                Present your digital QR or tap near counter sensor to verify pickup code{' '}
                <strong className="font-mono text-[#2B231B]">{activeOrder.pickupCode}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => openContactlessModal(activeOrder)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#8C6D46] hover:bg-[#735836] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            Open Pickup Pass
          </button>
        </div>

        {/* Order Details & Receipt */}
        <div className="mt-8 pt-6 border-t border-[#E8E2D9]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C7A6B] mb-4">
            Itemized Order Summary
          </h4>

          <div className="divide-y divide-[#ECE5DC] text-xs">
            {activeOrder.items.map((it) => (
              <div key={it.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#2B231B]">
                    {it.quantity}x {it.menuItem.name}
                  </span>
                  {it.selectedOptions.milk && (
                    <span className="text-[#8C7A6B] ml-2">({it.selectedOptions.milk})</span>
                  )}
                  {it.selectedOptions.extraShot && (
                    <span className="text-[#8C6D46] ml-2">+ Extra Double Shot</span>
                  )}
                </div>
                <span className="font-mono tabular-nums text-[#2B231B] font-medium">
                  €{it.lineTotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-[#DDD5C7] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-[#8C7A6B]">
              Payment method:{' '}
              <span className="font-semibold text-[#2B231B] capitalize">
                {activeOrder.paymentMethod.replace('_', ' ')}
              </span>
              {' · '}
              <span
                className={`font-semibold ${
                  activeOrder.paymentStatus === 'paid_online' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {activeOrder.paymentStatus === 'paid_online' ? 'Paid Online' : 'Tap Card/Phone at Pickup'}
              </span>
            </div>

            <div className="font-serif text-base font-bold text-[#2B231B]">
              Total:{' '}
              <span className="font-mono tabular-nums text-[#8C6D46]">
                €{activeOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Trigger */}
        <div className="mt-8 pt-6 border-t border-[#E8E2D9] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2B231B]">
              How was your experience today?
            </p>
            <p className="text-[11px] text-[#8C7A6B]">
              Share your thoughts on coffee quality and pickup speed with our baristas.
            </p>
          </div>
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#2B231B] bg-[#EFE9DF] hover:bg-[#E3DACB] rounded-lg transition-colors cursor-pointer border border-[#DDD5C7]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8C6D46]" />
            <span>Leave a Review</span>
          </button>
        </div>
      </div>
    </div>
  );
};
