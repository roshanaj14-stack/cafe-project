import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FlashIntroProps {
  onComplete: () => void;
}

export const FlashIntro: React.FC<FlashIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'reveal' | 'exit'>('enter');

  useEffect(() => {
    // Stage 1: Entrance animation begins immediately
    const t1 = setTimeout(() => {
      setPhase('reveal');
    }, 400);

    // Stage 2: Exit fade out starts around 2.4s
    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 2400);

    // Stage 3: Dismiss entirely
    const t3 = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1F1A15] text-[#FAF8F5] select-none transition-opacity duration-500 cursor-pointer ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Click anywhere to enter Les Amis"
    >
      {/* Subtle warm radial ambiance glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,183,120,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Decorative architectural borders */}
      <div className="absolute inset-6 sm:inset-12 border border-[#8C6D46]/20 rounded-3xl pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between text-[10px] font-mono tracking-widest text-[#8C7A6B] uppercase">
          <span>Saint-Germain-des-Prés</span>
          <span>Paris 6e · Est. 2026</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono tracking-widest text-[#8C7A6B] uppercase">
          <span>Specialty Coffee</span>
          <span>Pure Butter Viennoiserie</span>
        </div>
      </div>

      {/* Centered Flash Logo & Story */}
      <div className="relative text-center px-6 max-w-xl mx-auto space-y-6">
        {/* Steam / Aroma Accent */}
        <div
          className={`flex items-center justify-center gap-1.5 text-[#E2B778] transition-all duration-700 ${
            phase === 'reveal' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <span className="w-8 h-[1px] bg-[#8C6D46]/60" />
          <Sparkles className="w-4 h-4 text-[#E2B778] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#E2B778]">
            L'Expérience Parisienne
          </span>
          <span className="w-8 h-[1px] bg-[#8C6D46]/60" />
        </div>

        {/* Main Title: Les Amis */}
        <div className="overflow-hidden py-1">
          <h1
            className={`font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white transition-all duration-1000 ${
              phase === 'reveal'
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            Les Amis
          </h1>
        </div>

        {/* Subtitle / Tagline */}
        <p
          className={`font-sans text-xs sm:text-sm tracking-widest uppercase text-[#D4C3B2] transition-all duration-800 delay-200 ${
            phase === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Artisanal Café, Viennoiserie & Table d'Hôtes
        </p>

        {/* Gold Hairline Divider */}
        <div
          className={`w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E2B778] to-transparent mx-auto transition-all duration-1000 delay-300 ${
            phase === 'reveal' ? 'w-36 opacity-100' : 'w-4 opacity-0'
          }`}
        />

        {/* Progress Bar & Skip Hint */}
        <div className="pt-8 flex flex-col items-center gap-3">
          <div className="w-36 sm:w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-[#8C6D46] to-[#E2B778] rounded-full transition-all duration-[2400ms] ease-out ${
                phase === 'reveal' ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          <button
            onClick={onComplete}
            className="text-[11px] font-mono uppercase tracking-wider text-[#A39486] hover:text-[#FAF8F5] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Click anywhere or press Enter to skip</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
