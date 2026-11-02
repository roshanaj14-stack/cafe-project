import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Coffee, CheckCircle2, Smartphone, Check } from 'lucide-react';

export const LiveKDSQueue: React.FC = () => {
  const { orders, updateOrderStatus, markOrderContactlessPaid } = useCafe();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'brewing' | 'ready' | 'completed'>('all');

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'all') return true;
    return ord.status === filterStatus;
  });

  const activeCount = orders.filter((o) => o.status === 'pending' || o.status === 'brewing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="space-y-6">
      {/* KDS Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E5DDD0] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8C6D46] font-semibold">
            Live KDS Queue:
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2B231B] text-white font-mono font-bold tabular-nums">
            {activeCount} active
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold tabular-nums">
            {readyCount} ready for pickup
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Received' },
            { id: 'brewing', label: 'In Prep / Brewing' },
            { id: 'ready', label: 'Ready at Bar' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-[#2B231B] text-white shadow-2xs'
                  : 'bg-[#F4EDE2] text-[#5C5248] hover:bg-[#EBE3D6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#DDD5C7]">
          <p className="font-serif text-lg text-[#2B231B]">No orders in this category</p>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Incoming guest orders will appear here automatically with instant audio notifications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((ord) => {
            const isPending = ord.status === 'pending';
            const isBrewing = ord.status === 'brewing';
            const isReady = ord.status === 'ready';
            const isCompleted = ord.status === 'completed';

            return (
              <div
                key={ord.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all bg-white shadow-2xs ${
                  isReady
                    ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                    : isBrewing
                    ? 'border-[#8C6D46] ring-1 ring-[#8C6D46]/20'
                    : isPending
                    ? 'border-amber-400'
                    : 'border-[#E5DDD0] opacity-80'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-[#ECE5DC]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#2B231B]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800'
                              : isBrewing
                              ? 'bg-[#8C6D46] text-white'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#2B231B] mt-0.5">
                        {ord.customerName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[11px] font-bold text-[#8C6D46] bg-[#F4EDE2] px-2 py-0.5 rounded block">
                        {ord.pickupCode}
                      </span>
                      <span className="text-[10px] text-[#8C7A6B] block mt-0.5">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-3 space-y-2 text-xs">
                    {ord.items.map((it) => (
                      <div key={it.id} className="p-2 rounded-lg bg-[#FAF8F5] border border-[#ECE5DC]">
                        <div className="flex justify-between font-medium text-[#2B231B]">
                          <span>
                            <strong className="text-[#8C6D46] font-mono mr-1">
                              {it.quantity}x
                            </strong>{' '}
                            {it.menuItem.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#8C7A6B]">
                            €{it.lineTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Modifiers & Customizations */}
                        <div className="text-[11px] text-[#7A6D60] mt-1 space-y-0.5">
                          {it.selectedOptions.milk && (
                            <p>🥛 {it.selectedOptions.milk}</p>
                          )}
                          {it.selectedOptions.sweetness && (
                            <p>🍯 Sweetness: {it.selectedOptions.sweetness}</p>
                          )}
                          {it.selectedOptions.temperature && (
                            <p>❄️ {it.selectedOptions.temperature}</p>
                          )}
                          {it.selectedOptions.extraShot && (
                            <p className="text-[#8C6D46] font-semibold">⚡ Extra Double Shot</p>
                          )}
                          {it.selectedOptions.warming && (
                            <p className="text-[#8C6D46] font-semibold">🔥 Warm in stone oven</p>
                          )}
                          {it.selectedOptions.specialInstructions && (
                            <p className="italic text-[#8C7A6B]">
                              Note: "{it.selectedOptions.specialInstructions}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contactless Payment Status Badge */}
                  <div className="pt-2 pb-3 flex items-center justify-between text-xs border-t border-[#ECE5DC]">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#8C6D46]" />
                      <span className="text-[#6B5E52] text-[11px]">Payment:</span>
                    </div>

                    {ord.paymentStatus === 'paid_online' ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Paid Online
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Tap at Counter
                        </span>
                        <button
                          onClick={() => markOrderContactlessPaid(ord.id)}
                          className="text-[10px] px-2 py-0.5 bg-[#8C6D46] text-white rounded font-medium hover:bg-[#735836] cursor-pointer"
                          title="Confirm contactless tap at reader"
                        >
                          Verify Tap
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflow Action Buttons */}
                <div className="pt-3 border-t border-[#ECE5DC] flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'brewing')}
                      className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs text-white bg-[#8C6D46] hover:bg-[#735836] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Start Brewing / Prep</span>
                    </button>
                  )}

                  {isBrewing && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready')}
                      className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Ready at Bar</span>
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'completed')}
                      className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs text-white bg-[#2B231B] hover:bg-[#43372B] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Handed to Guest</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="w-full text-center py-2 text-xs text-[#8C7A6B] font-mono">
                      Order Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
