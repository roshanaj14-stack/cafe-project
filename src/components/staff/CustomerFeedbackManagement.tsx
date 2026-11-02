import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { CustomerFeedback } from '../../types/cafe';
import { Star, Reply } from 'lucide-react';

export const CustomerFeedbackManagement: React.FC = () => {
  const { feedbackList, replyToFeedback } = useCafe();
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const averageRating = (
    feedbackList.reduce((acc, f) => acc + f.rating, 0) / (feedbackList.length || 1)
  ).toFixed(1);

  const fiveStarsCount = feedbackList.filter((f) => f.rating === 5).length;

  const handleOpenReply = (item: CustomerFeedback) => {
    setSelectedFeedbackId(item.id);
    setReplyText(item.reply || '');
  };

  const handleSaveReply = (id: string) => {
    if (!replyText.trim()) return;
    replyToFeedback(id, replyText.trim());
    setSelectedFeedbackId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Customer Satisfaction Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-3xl font-bold text-[#2B231B] tabular-nums">
              {averageRating}
            </span>
            <span className="text-xs text-[#8C7A6B]">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-[#C4975C] text-[#C4975C]" />
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            5-Star Reviews
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">
            {fiveStarsCount} reviews ({Math.round((fiveStarsCount / (feedbackList.length || 1)) * 100)}%)
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Praising viennoiseries & espresso quality
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-2xs">
          <span className="text-xs font-mono uppercase text-[#8C7A6B] block">
            Team Response Rate
          </span>
          <span className="font-mono text-2xl font-bold text-[#8C6D46] tabular-nums mt-1 block">
            {feedbackList.filter((f) => f.reply).length} / {feedbackList.length}
          </span>
          <span className="text-[11px] text-[#665A4F] mt-0.5 block">
            Personalized replies published to guests
          </span>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#ECE5DC] pb-3">
          <h3 className="font-serif font-bold text-lg text-[#2B231B]">
            Customer Feedback & Moderation
          </h3>
          <p className="text-xs text-[#665A4F] mt-0.5">
            Respond directly to your guests. Your response will appear under their review on the customer portal.
          </p>
        </div>

        <div className="space-y-4">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-[#E5DDD0] bg-[#FAF8F5] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2B231B]">
                      {item.customerName}
                    </span>
                    <span className="text-xs text-[#8C7A6B]">({item.email})</span>
                    {item.orderNumber && (
                      <span className="font-mono text-[10px] bg-white border border-[#DDD5C7] px-2 py-0.5 rounded text-[#8C6D46]">
                        {item.orderNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= item.rating
                              ? 'fill-[#C4975C] text-[#C4975C]'
                              : 'text-[#DDD5C7]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#8C7A6B] text-[11px]">
                      · {item.date} · Focus: {item.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenReply(item)}
                  className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-[#8C6D46] bg-white hover:bg-[#F3EDE2] rounded-lg border border-[#DDD5C7] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>{item.reply ? 'Edit Response' : 'Reply to Guest'}</span>
                </button>
              </div>

              <p className="text-xs text-[#4A3E33] leading-relaxed">
                "{item.comment}"
              </p>

              {/* Published Reply */}
              {item.reply && selectedFeedbackId !== item.id && (
                <div className="p-3 rounded-lg bg-white border-l-2 border-[#8C6D46] text-xs">
                  <span className="font-semibold text-[#8C6D46] block text-[11px]">
                    Official Management Response:
                  </span>
                  <p className="text-[#665A4F] italic mt-0.5">
                    {item.reply}
                  </p>
                </div>
              )}

              {/* Reply Box if editing */}
              {selectedFeedbackId === item.id && (
                <div className="pt-2 border-t border-[#ECE5DC] space-y-2">
                  <label className="block text-xs font-semibold text-[#2B231B]">
                    Write Official Management Response
                  </label>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Thank you for visiting Les Amis! We are delighted..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#DDD5C7] bg-white text-[#2B231B]"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setSelectedFeedbackId(null)}
                      className="px-3 py-1.5 text-xs text-[#8C7A6B] hover:text-[#2B231B] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveReply(item.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2B231B] hover:bg-[#43372B] rounded-lg cursor-pointer"
                    >
                      Publish Response
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
