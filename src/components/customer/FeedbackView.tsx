import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { Star, Plus } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const { feedbackList, setIsFeedbackModalOpen } = useCafe();

  const averageRating = (
    feedbackList.reduce((acc, f) => acc + f.rating, 0) / (feedbackList.length || 1)
  ).toFixed(1);

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D46] block">
            Guest Reviews & Feedback
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#2B231B] mt-1">
            Experiences from Our Guests
          </h1>
          <p className="text-sm text-[#665A4F] mt-1">
            Authentic customer reviews on our specialty coffee, artisanal viennoiseries, and contactless counter pickup.
          </p>
        </div>

        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2B231B] hover:bg-[#43372B] rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Overview Metric Banner */}
      <div className="mt-8 p-6 rounded-3xl bg-[#F4EDE2] border border-[#E2D8CC] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-2xl border border-[#DDD5C7] text-center">
            <span className="font-serif text-3xl font-bold text-[#2B231B] block">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#C4975C] text-[#C4975C]" />
              ))}
            </div>
            <span className="text-[10px] text-[#8C7A6B] block mt-1">
              Average Rating
            </span>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#2B231B]">
              Artisanal Standards in Saint-Germain
            </h3>
            <p className="text-xs text-[#665A4F] mt-0.5">
              Based on {feedbackList.length} verified dining & contactless pickup reviews.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#8C6D46] font-medium text-right sm:border-l sm:border-[#DDD5C7] sm:pl-6">
          <p>✓ 100% Contactless Pickup available</p>
          <p>✓ Specialty double-origin espresso</p>
          <p>✓ Pure French butter viennoiserie</p>
        </div>
      </div>

      {/* Feedback list */}
      <div className="mt-8 space-y-4">
        {feedbackList.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[#2B231B] text-base">
                    {item.customerName}
                  </span>
                  {item.orderNumber && (
                    <span className="text-[11px] font-mono text-[#8C7A6B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#ECE5DC]">
                      {item.orderNumber}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.rating
                            ? 'fill-[#C4975C] text-[#C4975C]'
                            : 'text-[#DDD5C7]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C7A6B]">
                    · {item.date} · Category: {item.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A3E33] leading-relaxed">
              "{item.comment}"
            </p>

            {/* Manager reply */}
            {item.reply && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#FAF8F5] border-l-2 border-[#8C6D46] text-xs space-y-1">
                <span className="font-semibold text-[#8C6D46] block text-[11px]">
                  Official Reply from Les Amis Management:
                </span>
                <p className="text-[#665A4F] italic">
                  {item.reply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
