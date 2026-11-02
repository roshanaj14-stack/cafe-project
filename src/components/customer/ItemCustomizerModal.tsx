import React, { useState, useEffect } from 'react';
import { useCafe } from '../../context/CafeContext';
import { MenuItem, SelectedOptions } from '../../types/cafe';
import { X, Plus, Minus, Check } from 'lucide-react';

export const ItemCustomizerModal: React.FC = () => {
  const {
    selectedItemForCustomizer,
    closeCustomizer,
    addToCart,
  } = useCafe();

  const [quantity, setQuantity] = useState(1);
  const [selectedMilk, setSelectedMilk] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [selectedTemperature, setSelectedTemperature] = useState<string>('');
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [warming, setWarming] = useState<boolean>(true);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  useEffect(() => {
    if (selectedItemForCustomizer) {
      setQuantity(1);
      const opts = selectedItemForCustomizer.customizationOptions;
      setSelectedMilk(opts?.milk ? opts.milk[0] : '');
      setSelectedSweetness(opts?.sweetness ? opts.sweetness[0] : '');
      setSelectedTemperature(opts?.temperature ? opts.temperature[0] : '');
      setExtraShot(false);
      setWarming(opts?.warming !== false);
      setSpecialInstructions('');
    }
  }, [selectedItemForCustomizer]);

  if (!selectedItemForCustomizer) return null;

  const item: MenuItem = selectedItemForCustomizer;
  const opts = item.customizationOptions;

  const basePrice = item.price;
  const extraShotCost = extraShot ? 0.90 : 0;
  const unitPrice = basePrice + extraShotCost;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const selectedOptions: SelectedOptions = {
      milk: selectedMilk || undefined,
      sweetness: selectedSweetness || undefined,
      temperature: selectedTemperature || undefined,
      extraShot: extraShot || undefined,
      warming: opts?.warming ? warming : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    addToCart(item, selectedOptions, quantity);
    closeCustomizer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
        {/* Header with image */}
        <div className="relative h-48 bg-[#EAE3D6] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <button
            onClick={closeCustomizer}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider text-[#E8CBA3] font-mono">
              {item.category}
            </span>
            <h2 className="text-2xl font-serif font-bold text-white drop-shadow-xs">
              {item.name}
            </h2>
            <p className="text-xs text-[#E8E2D9] italic">
              {item.frenchName}
            </p>
          </div>
        </div>

        {/* Customization Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs sm:text-sm text-[#665A4F] leading-relaxed">
            {item.description}
          </p>

          {/* Milk Selection */}
          {opts?.milk && opts.milk.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
                Milk Choice
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {opts.milk.map((milk) => {
                  const isSelected = selectedMilk === milk;
                  return (
                    <button
                      key={milk}
                      type="button"
                      onClick={() => setSelectedMilk(milk)}
                      className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                          : 'border-[#E2D8CC] bg-white text-[#5C5248] hover:border-[#8C6D46]'
                      }`}
                    >
                      <span>{milk}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8C6D46]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Temperature / Serving Style */}
          {opts?.temperature && opts.temperature.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
                Serving Temperature
              </label>
              <div className="grid grid-cols-2 gap-2">
                {opts.temperature.map((temp) => {
                  const isSelected = selectedTemperature === temp;
                  return (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setSelectedTemperature(temp)}
                      className={`text-center p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                          : 'border-[#E2D8CC] bg-white text-[#5C5248] hover:border-[#8C6D46]'
                      }`}
                    >
                      {temp}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {opts?.sweetness && opts.sweetness.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
                Sweetness Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {opts.sweetness.map((sweet) => {
                  const isSelected = selectedSweetness === sweet;
                  return (
                    <button
                      key={sweet}
                      type="button"
                      onClick={() => setSelectedSweetness(sweet)}
                      className={`text-center p-2 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                          : 'border-[#E2D8CC] bg-white text-[#5C5248] hover:border-[#8C6D46]'
                      }`}
                    >
                      {sweet}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Shot & Warming Add-ons */}
          <div className="space-y-2.5 pt-2 border-t border-[#E8E2D9]">
            {opts?.extraShots && (
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2D8CC] bg-white cursor-pointer hover:border-[#8C6D46] transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="w-4 h-4 accent-[#8C6D46] rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#2B231B] block">
                      Extra Double Shot Espresso
                    </span>
                    <span className="text-[11px] text-[#8C7A6B]">
                      Single-origin Ethiopian Yirgacheffe
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#8C6D46] font-semibold">
                  +€0.90
                </span>
              </label>
            )}

            {opts?.warming && (
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2D8CC] bg-white cursor-pointer hover:border-[#8C6D46] transition-colors">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={warming}
                    onChange={(e) => setWarming(e.target.checked)}
                    className="w-4 h-4 accent-[#8C6D46] rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#2B231B] block">
                      Warm in Stone Oven (Crisp)
                    </span>
                    <span className="text-[11px] text-[#8C7A6B]">
                      Lightly toasted for 90 seconds in our stone bakery oven
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#8C7A6B]">Included</span>
              </label>
            )}
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-1">
              Special Instructions (Barista Note)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Extra hot, oat milk on side, cinnamon dusting"
              className="w-full text-xs p-2.5 rounded-lg border border-[#E2D8CC] bg-white focus:outline-none focus:border-[#8C6D46] text-[#2B231B]"
            />
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between gap-4">
            <div className="flex items-center border border-[#DDD5C7] rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-[#5C5248] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-mono font-bold text-[#2B231B] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 text-[#5C5248] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-between px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#2B231B] hover:bg-[#43372B] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Add to Order</span>
              <span className="font-mono tabular-nums text-[#E2B778]">
                €{totalPrice.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
