import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const {
    inventory,
    restockInventory,
    menuItems,
    toggleMenuItemAvailability,
  } = useCafe();

  const [activeTab, setActiveTab] = useState<'ingredients' | 'menu_availability'>('ingredients');

  const lowStockCount = inventory.filter((i) => i.status === 'low_stock' || i.currentStock <= i.minThreshold).length;

  const totalInventoryValuation = inventory.reduce(
    (acc, item) => acc + item.currentStock * item.costPerUnit,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Inventory Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Tracked Inventory Lines
          </span>
          <span className="font-mono text-2xl font-bold text-[#2B231B] tabular-nums mt-1 block">
            {inventory.length} references
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Specialty beans, dairy, butter, cocoa & packaging
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Low Stock Alerts
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-2xl font-bold text-amber-700 tabular-nums">
              {lowStockCount} alerts
            </span>
            {lowStockCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-100 text-amber-800 rounded">
                Restock needed
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Stock under minimum threshold
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Total Inventory Valuation
          </span>
          <span className="font-mono text-2xl font-bold text-[#8C6D46] tabular-nums mt-1 block">
            €{totalInventoryValuation.toFixed(2)}
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Valued at direct supplier unit costs
          </span>
        </div>
      </div>

      {/* Tabs Switcher: Raw Ingredients vs Customer Menu 86'ing */}
      <div className="flex items-center gap-2 p-1 bg-[#F0EAE1] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ingredients'
              ? 'bg-white text-[#2B231B] shadow-2xs'
              : 'text-[#665A4F] hover:text-[#2B231B]'
          }`}
        >
          Raw Ingredients & Storage
        </button>
        <button
          onClick={() => setActiveTab('menu_availability')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'menu_availability'
              ? 'bg-white text-[#2B231B] shadow-2xs'
              : 'text-[#665A4F] hover:text-[#2B231B]'
          }`}
        >
          Menu Availability (86 / Pause Items)
        </button>
      </div>

      {activeTab === 'ingredients' ? (
        /* Table of Raw Ingredients & Packaging */
        <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-[#ECE5DC] flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#2B231B]">
              Stock Levels & Supplier Ledgers
            </h3>
            <span className="text-xs text-[#8C7A6B]">
              Certified French & artisan suppliers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#8C7A6B] uppercase font-mono text-[10px] border-b border-[#ECE5DC]">
                <tr>
                  <th className="px-4 py-3">Ingredient / SKU</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Min Threshold</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE5DC]">
                {inventory.map((inv) => {
                  const isLow = inv.currentStock <= inv.minThreshold;

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#2B231B]">{inv.name}</div>
                        <div className="text-[11px] font-mono text-[#8C7A6B]">{inv.sku}</div>
                      </td>

                      <td className="px-4 py-3.5 text-[#5C5248]">
                        {inv.supplier}
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold tabular-nums text-[#2B231B]">
                        {inv.currentStock} {inv.unit}
                      </td>

                      <td className="px-4 py-3.5 font-mono tabular-nums text-[#8C7A6B]">
                        {inv.minThreshold} {inv.unit}
                      </td>

                      <td className="px-4 py-3.5">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Optimal
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => restockInventory(inv.id, 5)}
                            className="px-2.5 py-1 rounded bg-[#EFE9DF] hover:bg-[#E3DACB] text-[#2B231B] font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => restockInventory(inv.id, 10)}
                            className="px-2.5 py-1 rounded bg-[#EFE9DF] hover:bg-[#E3DACB] text-[#2B231B] font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => restockInventory(inv.id, 25)}
                            className="px-2.5 py-1 rounded bg-[#8C6D46] hover:bg-[#735836] text-white font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Add 25 units"
                          >
                            +25
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Menu Availability & 86'ing items */
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2B231B]">
              Real-Time Customer Menu Availability (86 System)
            </h3>
            <p className="text-xs text-[#665A4F] mt-0.5">
              Toggling an item here will instantly update the customer menu to "Sold Out (86'd)" and prevent new orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  item.inStock
                    ? 'border-[#E5DDD0] bg-[#FAF8F5]'
                    : 'border-red-200 bg-red-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#2B231B] line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#8C7A6B]">
                      €{item.price.toFixed(2)} · {item.stockCount} in stock
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleMenuItemAvailability(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    item.inStock
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {item.inStock ? 'Available' : '86’d (Sold Out)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
