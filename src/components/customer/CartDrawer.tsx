import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { PaymentMethod, PickupType } from '../../types/cafe';
import { X, Trash2, Plus, Minus, Smartphone, CreditCard, Sparkles, Clock, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    loyalty,
  } = useCafe();

  // Form states
  const [customerName, setCustomerName] = useState(loyalty.name || 'Roshan A.');
  const [customerEmail, setCustomerEmail] = useState(loyalty.email || 'roshanaj14@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(loyalty.phone || '+1 (555) 544-3322');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('contactless_pickup');
  const [pickupType, setPickupType] = useState<PickupType>('asap');
  const [scheduledTime, setScheduledTime] = useState<string>('09:45 AM');
  const [tipRate, setTipRate] = useState<number>(0.18); // 18% default
  const [customTip, setCustomTip] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  if (!isCartOpen) return null;

  const tipAmount = customTip !== '' ? parseFloat(customTip) || 0 : Math.round(cartSubtotal * tipRate * 100) / 100;
  const tax = Math.round(cartSubtotal * 0.1 * 100) / 100;
  const grandTotal = Math.max(0, Math.round((cartSubtotal + tax + tipAmount - discountAmount) * 100) / 100);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'AMIS10' || code === 'BRUNCH-20' || code === 'FREE-CROISSANT' || code === 'FREE-COFFEE') {
      const discount = code === 'BRUNCH-20' ? Math.round(cartSubtotal * 0.2 * 100) / 100 : 3.50;
      setDiscountAmount(discount);
      setPromoMessage(`Reward code applied! -€${discount.toFixed(2)} off`);
    } else {
      setPromoMessage('Invalid voucher. Try "AMIS10" or your Loyalty Club codes.');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    placeOrder({
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      pickupType,
      tip: tipAmount,
      discount: discountAmount,
      scheduledTime: pickupType === 'scheduled' ? scheduledTime : undefined,
    });

    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-[#FAF8F5] w-full max-w-md sm:max-w-lg h-full shadow-2xl flex flex-col border-l border-[#DDD5C7] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C6D46]">
                Your Order
              </span>
              <span className="text-xs text-[#8C7A6B]">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2B231B]">
              Cart & Pickup Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#8C7A6B] hover:text-[#2B231B] rounded-lg hover:bg-[#F3EDE2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#8C6D46] mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg font-bold text-[#2B231B]">
                Your cart is empty
              </p>
              <p className="text-xs text-[#8C7A6B] mt-1 max-w-xs mx-auto">
                Explore our viennoiserie, single-origin coffees, and savory brunch tartines to add your favorites.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-[#2B231B] rounded-lg hover:bg-[#43372B] transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="p-3.5 rounded-xl border border-[#E5DDD0] bg-white flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#EAE3D6]"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#2B231B] truncate">
                          {cartItem.menuItem.name}
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#2B231B] tabular-nums shrink-0">
                          €{cartItem.lineTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Selected Customizations summary */}
                      <div className="text-[11px] text-[#7A6D60] mt-0.5 space-y-0.5">
                        {cartItem.selectedOptions.milk && (
                          <p>Milk: {cartItem.selectedOptions.milk}</p>
                        )}
                        {cartItem.selectedOptions.temperature && (
                          <p>{cartItem.selectedOptions.temperature}</p>
                        )}
                        {cartItem.selectedOptions.sweetness && (
                          <p>Sweetness: {cartItem.selectedOptions.sweetness}</p>
                        )}
                        {cartItem.selectedOptions.extraShot && (
                          <p className="text-[#8C6D46] font-medium">+ Extra Double Shot (€0.90)</p>
                        )}
                        {cartItem.selectedOptions.warming && (
                          <p className="text-[#8C6D46]">Warmed in stone oven</p>
                        )}
                        {cartItem.selectedOptions.specialInstructions && (
                          <p className="italic text-[#8C7A6B]">
                            Note: "{cartItem.selectedOptions.specialInstructions}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper and Delete */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-[#DDD5C7] rounded-md bg-[#FAF8F5] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(cartItem.id, -1)}
                            className="p-1 hover:bg-[#EAE2D5] text-[#5C5248] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-[#2B231B] tabular-nums">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(cartItem.id, 1)}
                            className="p-1 hover:bg-[#EAE2D5] text-[#5C5248] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(cartItem.id)}
                          className="text-[#8C7A6B] hover:text-[#DC2626] transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Pickup Timing */}
              <div className="p-4 rounded-xl border border-[#E5DDD0] bg-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#8C6D46]" />
                  <span>Pickup Timing</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupType('asap')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                      pickupType === 'asap'
                        ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                        : 'border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46]'
                    }`}
                  >
                    <span className="font-semibold block">ASAP Pickup</span>
                    <span className="text-[11px] text-[#8C7A6B]">Ready in ~10-12 mins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickupType('scheduled')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                      pickupType === 'scheduled'
                        ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                        : 'border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46]'
                    }`}
                  >
                    <span className="font-semibold block">Schedule Time</span>
                    <span className="text-[11px] text-[#8C7A6B]">Choose pickup window</span>
                  </button>
                </div>

                {pickupType === 'scheduled' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-[#6B5E52] mb-1 font-medium">
                      Select pickup time:
                    </label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#DDD5C7] bg-white text-[#2B231B]"
                    >
                      <option value="09:15 AM">09:15 AM (Morning)</option>
                      <option value="09:45 AM">09:45 AM</option>
                      <option value="10:30 AM">10:30 AM (Coffee Break)</option>
                      <option value="12:15 PM">12:15 PM (Midday Lunch)</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="04:00 PM">04:00 PM (Afternoon Tea)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="p-4 rounded-xl border border-[#E5DDD0] bg-white space-y-3">
                <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
                  Payment Method
                </label>

                {/* Option 1: Contactless Pay at Pickup */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('contactless_pickup')}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'contactless_pickup'
                      ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                      : 'border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46]'
                  }`}
                >
                  <div className="p-1.5 rounded-md bg-[#8C6D46] text-white shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2B231B]">
                        Contactless Pay at Pickup (Recommended)
                      </span>
                      {paymentMethod === 'contactless_pickup' && (
                        <Check className="w-4 h-4 text-[#8C6D46]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6D60] mt-0.5">
                      No card needed now. We generate an express pass; simply tap your phone or card at the pickup counter terminal.
                    </p>
                  </div>
                </button>

                {/* Option 2: Digital Express (Apple Pay / Google Pay) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                      : 'border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46]'
                  }`}
                >
                  <div className="p-1.5 rounded-md bg-[#2B231B] text-white shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2B231B]">
                        Apple Pay / Google Pay (Digital Express)
                      </span>
                      {paymentMethod === 'apple_pay' && (
                        <Check className="w-4 h-4 text-[#8C6D46]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6D60] mt-0.5">
                      Instant 1-click authorization via your device's biometric wallet.
                    </p>
                  </div>
                </button>

                {/* Option 3: Standard Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card_online')}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'card_online'
                      ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                      : 'border-[#E2D8CC] text-[#5C5248] hover:border-[#8C6D46]'
                  }`}
                >
                  <div className="p-1.5 rounded-md bg-[#4A3E33] text-white shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2B231B]">
                        Credit / Debit Card Online
                      </span>
                      {paymentMethod === 'card_online' && (
                        <Check className="w-4 h-4 text-[#8C6D46]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6D60] mt-0.5">
                      Standard Visa, Mastercard or American Express prepayment.
                    </p>
                  </div>
                </button>
              </div>

              {/* Tip Selection */}
              <div className="p-4 rounded-xl border border-[#E5DDD0] bg-white space-y-2">
                <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
                  Barista & Bakery Team Gratuity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { rate: 0.15, label: '15%' },
                    { rate: 0.18, label: '18%' },
                    { rate: 0.20, label: '20%' },
                    { rate: 0, label: 'Custom' },
                  ].map((tipOpt) => {
                    const isSelected = customTip === '' && tipRate === tipOpt.rate && tipOpt.rate !== 0;
                    return (
                      <button
                        key={tipOpt.label}
                        type="button"
                        onClick={() => {
                          if (tipOpt.rate === 0) {
                            setCustomTip('0.00');
                          } else {
                            setCustomTip('');
                            setTipRate(tipOpt.rate);
                          }
                        }}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                            : 'border-[#DDD5C7] text-[#5C5248] hover:border-[#8C6D46]'
                        }`}
                      >
                        {tipOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promo / Loyalty Club Voucher Code */}
              <div className="p-4 rounded-xl border border-[#E5DDD0] bg-white space-y-2">
                <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
                  Promo or Loyalty Reward Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g., AMIS10, FREE-CROISSANT"
                    className="flex-1 text-xs p-2 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] uppercase tracking-wider text-[#2B231B]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-2 text-xs font-semibold text-[#2B231B] bg-[#EFE9DF] hover:bg-[#E3DACB] rounded-lg cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-[11px] text-[#8C6D46] font-medium">
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Customer Contact Details */}
              <div className="p-4 rounded-xl border border-[#E5DDD0] bg-white space-y-2.5">
                <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider">
                  Pickup Contact Details
                </label>
                <div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest Name"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email for digital receipt & pass"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] text-[#2B231B]"
                  />
                </div>
              </div>

              {/* Order Calculations */}
              <div className="p-4 rounded-xl bg-[#F4EDE2] border border-[#E5DDD0] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B5E52]">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">€{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B5E52]">
                  <span>Tax (10%):</span>
                  <span className="font-mono tabular-nums">€{tax.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-[#6B5E52]">
                    <span>Team Gratuity:</span>
                    <span className="font-mono tabular-nums">€{tipAmount.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-medium">
                    <span>Loyalty Reward Voucher:</span>
                    <span className="font-mono tabular-nums">-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#DDD5C7] flex justify-between font-serif text-base font-bold text-[#2B231B]">
                  <span>Total:</span>
                  <span className="font-mono tabular-nums">€{grandTotal.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-[#8C6D46] pt-1">
                  ✨ You will earn <strong className="font-mono">{Math.round(grandTotal * 10)} points</strong> in the Les Amis Club with this order.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8E2D9] bg-white">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-[#2B231B] hover:bg-[#43372B] transition-all shadow-md flex items-center justify-between cursor-pointer active:scale-98"
            >
              <span>
                {paymentMethod === 'contactless_pickup'
                  ? 'Confirm & Get Contactless Pass'
                  : 'Place & Authorize Order'}
              </span>
              <span className="font-mono tabular-nums text-[#E2B778] font-bold">
                €{grandTotal.toFixed(2)}
              </span>
            </button>
            <p className="text-[10px] text-center text-[#8C7A6B] mt-2">
              Swift counter pickup guaranteed at Les Amis · 75006 Paris
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
