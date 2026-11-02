import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Star, X, CheckCircle2 } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    submitFeedback,
    loyalty,
    orders,
  } = useCafe();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<'coffee_food' | 'service' | 'ambiance' | 'pickup_speed'>('coffee_food');
  const [customerName, setCustomerName] = useState(loyalty.name || 'Roshan A.');
  const [email, setEmail] = useState(loyalty.email || 'roshanaj14@gmail.com');
  const [orderNumber, setOrderNumber] = useState(orders.length > 0 ? orders[0].orderNumber : '');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isFeedbackModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitFeedback({
      customerName,
      email,
      rating,
      category,
      comment: comment.trim(),
      orderNumber: orderNumber.trim() || undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsFeedbackModalOpen(false);
      setComment('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D9]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C6D46]">
              Your Feedback Matters
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2B231B] mt-0.5">
              Share Your Experience
            </h2>
            <p className="text-xs text-[#665A4F] mt-1">
              Help us refine our roasts, viennoiseries, and contactless pickup counter.
            </p>
          </div>
          <button
            onClick={() => setIsFeedbackModalOpen(false)}
            className="p-1.5 text-[#8C7A6B] hover:text-[#2B231B] rounded-lg hover:bg-[#EFE9DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2B231B]">
              Thank You Kindly!
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              Your review has been submitted to the management and barista team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-[#C4975C] hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#C4975C] text-[#C4975C]'
                          : 'text-[#DDD5C7]'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono text-xs font-bold text-[#2B231B]">
                  {rating} / 5 stars
                </span>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-2">
                Feedback Focus
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'coffee_food', label: '☕ Coffee & Pastries' },
                  { id: 'pickup_speed', label: '⚡ Contactless Pickup Speed' },
                  { id: 'service', label: '🤝 Hospitality & Baristas' },
                  { id: 'ambiance', label: '🌿 Ambience & Setting' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-colors cursor-pointer ${
                      category === cat.id
                        ? 'border-[#8C6D46] bg-[#F4EDE2] text-[#2B231B]'
                        : 'border-[#E2D8CC] bg-white text-[#5C5248] hover:border-[#8C6D46]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-[#2B231B] uppercase tracking-wider mb-1.5">
                Your Review
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of the coffee roast, the warmth of the viennoiserie, or the pickup pass?"
                className="w-full text-xs p-3 rounded-xl border border-[#DDD5C7] bg-white text-[#2B231B] focus:outline-none focus:border-[#8C6D46]"
              />
            </div>

            {/* Name, Email, Order Ref */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-2.5 rounded-lg border border-[#DDD5C7] bg-white text-[#2B231B]"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Order # (e.g. #LA-381)"
                  className="w-full p-2.5 rounded-lg border border-[#DDD5C7] bg-white text-[#2B231B] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-[#2B231B] hover:bg-[#43372B] transition-colors cursor-pointer shadow-xs"
            >
              Submit Guest Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
