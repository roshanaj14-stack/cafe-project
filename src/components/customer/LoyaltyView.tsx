import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { Coffee, Gift, QrCode, CheckCircle2 } from 'lucide-react';

export const LoyaltyView: React.FC = () => {
  const { loyalty, redeemReward, addLoyaltyStamp } = useCafe();
  const [redeemedCodeMessage, setRedeemedCodeMessage] = useState<string | null>(null);

  const stampsMax = 8;
  const stampsCount = loyalty.stamps;

  const handleRedeem = (rewardId: string, title: string, code: string) => {
    const success = redeemReward(rewardId);
    if (success) {
      setRedeemedCodeMessage(`Congratulations! You have unlocked "${title}". Use promo code: ${code}`);
    } else {
      setRedeemedCodeMessage('Insufficient points balance for this reward.');
    }
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'connoisseur':
        return { label: "Connoisseur d'Or", nextReq: 'Top Tier Reached', progress: 100 };
      case 'regulier':
        return { label: 'Bistro Regular', nextReq: '580 pts until Connoisseur', progress: 65 };
      default:
        return { label: 'Café Flâneur', nextReq: '200 pts until Regular', progress: 30 };
    }
  };

  const tierInfo = getTierInfo(loyalty.tier);

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* View Header */}
      <div className="pb-6 border-b border-[#E8E2D9]">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D46] block">
          Customer Loyalty Program
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B231B] mt-1">
          Les Amis Club
        </h1>
        <p className="text-sm text-[#665A4F] mt-1 max-w-2xl">
          Every visit, coffee, and bakery order earns you points and stamps. Enjoy complimentary barista drinks, private tastings, and seasonal perks.
        </p>
      </div>

      {redeemedCodeMessage && (
        <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{redeemedCodeMessage}</span>
          </div>
          <button
            onClick={() => setRedeemedCodeMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Member Card & Tier Showcase */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Physical-style Digital Loyalty Card (Left 6 cols) */}
        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#2B231B] via-[#382D23] to-[#1C1611] text-white shadow-xl border border-[#4A3D30] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-[#E2B778]/10 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2B778] block">
                  Privilege Member Pass
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white mt-1">
                  Les Amis Paris
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C4B5A2] block">
                  Tier
                </span>
                <span className="text-xs font-semibold text-[#E2B778]">
                  {tierInfo.label}
                </span>
              </div>
            </div>

            {/* Member Details */}
            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-[#A39486] uppercase tracking-wider">
                  Member
                </p>
                <p className="font-serif text-lg font-bold text-white">
                  {loyalty.name}
                </p>
                <p className="text-[10px] font-mono text-[#C4B5A2]">
                  ID: {loyalty.memberId} · Member since {loyalty.memberSince}
                </p>
              </div>

              {/* Barcode & Mini QR */}
              <div className="text-right">
                <div className="inline-block p-1.5 bg-white/10 rounded-lg backdrop-blur-xs">
                  <QrCode className="w-7 h-7 text-[#E2B778]" />
                </div>
              </div>
            </div>

            {/* Points & Stats Strip */}
            <div className="mt-6 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-[#A39486] block">Points Balance</span>
                <span className="font-mono text-base font-bold text-[#E2B778] tabular-nums">
                  {loyalty.points} pts
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A39486] block">Coffee Stamps</span>
                <span className="font-mono text-base font-bold text-white tabular-nums">
                  {loyalty.stamps} / 8
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#A39486] block">Total Visits</span>
                <span className="font-mono text-base font-bold text-white tabular-nums">
                  {loyalty.visitsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-[#E5DDD0] text-xs">
            <div className="flex justify-between items-center text-[#6B5E52] mb-1.5">
              <span className="font-semibold text-[#2B231B]">{tierInfo.label}</span>
              <span className="font-mono text-[11px] text-[#8C6D46]">{tierInfo.nextReq}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EFE9DF] overflow-hidden">
              <div
                className="h-full bg-[#8C6D46] rounded-full transition-all duration-500"
                style={{ width: `${tierInfo.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 8-Stamp Coffee Loyalty Card (Right 6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E5DDD0] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C6D46]">
                Digital Stamp Card
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2B231B]">
                8 Coffees = 1 Free Drink
              </h3>
            </div>
            <button
              onClick={addLoyaltyStamp}
              className="px-3 py-1.5 text-xs font-semibold text-[#8C6D46] bg-[#F4EDE2] hover:bg-[#EBE2D3] rounded-lg transition-colors cursor-pointer border border-[#DDD5C7]"
              title="Test stamping interaction"
            >
              + Stamp Visit
            </button>
          </div>

          <p className="text-xs text-[#665A4F] mt-2">
            Each coffee purchased adds an artisan seal. Complete all 8 slots to claim any specialty beverage on the house.
          </p>

          {/* 8-slot stamp grid */}
          <div className="mt-6 grid grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: stampsMax }).map((_, idx) => {
              const isStamped = idx < stampsCount;
              const isFreeRewardSlot = idx === stampsMax - 1;

              return (
                <div
                  key={idx}
                  className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                    isStamped
                      ? 'border-[#8C6D46] bg-[#F7F2EB] shadow-2xs'
                      : isFreeRewardSlot
                      ? 'border-dashed border-[#E2B778] bg-[#FFFBF5]'
                      : 'border-dashed border-[#DCD3C5] bg-[#FAF8F5]'
                  }`}
                >
                  {isStamped ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#8C6D46] text-white flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                        LA
                      </div>
                      <span className="text-[9px] font-mono uppercase text-[#8C6D46] mt-1">
                        Stamped
                      </span>
                    </div>
                  ) : isFreeRewardSlot ? (
                    <div className="flex flex-col items-center">
                      <Gift className="w-6 h-6 text-[#C4975C]" />
                      <span className="text-[9px] font-bold text-[#8C6D46] mt-1 leading-tight">
                        Free Drink!
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-[#B0A294]">
                      <Coffee className="w-5 h-5 opacity-40" />
                      <span className="text-[10px] font-mono mt-1">
                        {idx + 1}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] text-xs text-[#7A6D60] flex items-center justify-between">
            <span>
              Progress: <strong>{stampsCount} / 8</strong>
            </span>
            {stampsCount >= 8 ? (
              <span className="font-semibold text-emerald-700">
                🎉 Ready to redeem at counter!
              </span>
            ) : (
              <span>Only {8 - stampsCount} more coffees until your reward</span>
            )}
          </div>
        </div>
      </div>

      {/* Rewards Store */}
      <div className="mt-12">
        <div className="flex items-end justify-between pb-4 border-b border-[#E8E2D9]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D46]">
              Perk Catalog
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2B231B] mt-0.5">
              Redeem Points for Treats
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8C7A6B]">
            Balance: <strong className="text-[#2B231B]">{loyalty.points} pts</strong>
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loyalty.availableRewards.map((reward) => {
            const canAfford = loyalty.points >= reward.costPoints;
            const isRedeemed = reward.isRedeemed;

            return (
              <div
                key={reward.id}
                className="p-5 rounded-2xl bg-white border border-[#E5DDD0] flex flex-col justify-between shadow-2xs hover:border-[#8C6D46] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#8C6D46] bg-[#F4EDE2] px-2 py-0.5 rounded">
                      {reward.costPoints} pts
                    </span>
                    <Gift className="w-4 h-4 text-[#8C6D46]" />
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#2B231B] mt-3 leading-snug">
                    {reward.title}
                  </h4>
                  <p className="text-xs text-[#665A4F] mt-1.5 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#ECE5DC]">
                  {isRedeemed ? (
                    <div className="text-center p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-mono">
                      Promo Code: {reward.code}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRedeem(reward.id, reward.title, reward.code)}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        canAfford
                          ? 'bg-[#2B231B] text-white hover:bg-[#43372B]'
                          : 'bg-[#F2EDE5] text-[#A39486] cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem Voucher' : `Need ${reward.costPoints - loyalty.points} more pts`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
