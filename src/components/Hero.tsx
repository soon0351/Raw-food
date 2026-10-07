import React from 'react';
import { ShoppingBag, ChevronDown, Check, Sparkles, Clock, Sprout } from 'lucide-react';

interface HeroProps {
  onOpenOrder: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrder, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F4EC] to-[#F1ECE1] pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#E3DC CE]">
      {/* Subtle organic background motifs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#E5ECD8]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#EFE8D6]/60 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Big Headline & Major CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            
            {/* Honest Food Indicator (Clean text, no pill clutter) */}
            <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#3D6645] bg-[#E9EFE6] px-4 py-1.5 rounded-full border border-[#D0DEC9]">
              <Sprout className="w-4 h-4 text-[#2A4830]" />
              <span>100% 국내산 50가지 곡물과 채소 · 순수 자연식</span>
            </div>

            {/* Core Required Headline: "하루한잔, 간편한 한끼" */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1F3A24] tracking-tight leading-[1.18] text-balance">
                하루한잔, <br className="hidden sm:inline" />
                <span className="text-[#2A4830] underline decoration-[#8AA786]/40 underline-offset-8">
                  간편한 한끼
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-[#47433B] pt-1">
                물이나 우유에 흔들어 30초면 완성되는 고소한 생식
              </p>
            </div>

            {/* Honest Product Description (No medicine or weight loss claims) */}
            <p className="text-base sm:text-lg text-[#615C53] leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              바쁜 아침과 지친 저녁, 끼니 챙기기 번거로우셨나요? <br className="hidden sm:inline" />
              정직하게 엄선한 우리 땅의 50가지 통곡물과 제철 채소를 영하 40℃ 급속 동결건조로 곱게 담았습니다. 
              설탕과 첨가물 없이 원재료 고유의 고소하고 담백한 풍미를 느껴보세요.
            </p>

            {/* Major Required Big Order Button */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onOpenOrder}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-xl sm:text-2xl font-extrabold text-white bg-[#2A4830] hover:bg-[#1E3723] active:scale-98 rounded-2xl shadow-xl shadow-[#2A4830]/25 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <ShoppingBag className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>주문하기</span>
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl font-bold text-[#2A4830] bg-[#EDE7DA] hover:bg-[#E3DC CE] active:scale-98 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#DACFBF]"
              >
                <span>재료 & 마시는 법</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 3 Value Points (Large & Clear) */}
            <div className="pt-4 border-t border-[#DFD8CA] grid grid-cols-3 gap-3 text-center sm:text-left">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-[#2A4830]">50가지</div>
                <div className="text-xs sm:text-sm font-semibold text-[#666157]">국내산 곡물·채소</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-[#2A4830]">30초</div>
                <div className="text-xs sm:text-sm font-semibold text-[#666157]">흔들면 끝나는 식사</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-[#2A4830]">0%</div>
                <div className="text-xs sm:text-sm font-semibold text-[#666157]">설탕·합성첨가물</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase of the Saengsik Drink & Natural Ingredients */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-[#FAF7F0] border-2 border-[#DFD7C7] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#3D6645]/10">
              
              {/* Natural Raw Meal Visual Representation */}
              <div className="relative bg-gradient-to-b from-[#F2ECE0] to-[#E5DEC D] rounded-2xl p-6 flex flex-col items-center justify-center border border-[#D8CEBC] overflow-hidden">
                
                {/* Visual Glass & Bottle Shaker Art */}
                <div className="relative w-52 h-64 flex items-end justify-center">
                  
                  {/* Eco Shaker Bottle Glass */}
                  <div className="relative w-36 h-56 bg-white/70 backdrop-blur-sm rounded-3xl border-4 border-[#3D6645]/40 shadow-xl overflow-hidden flex flex-col justify-end p-2">
                    
                    {/* Bottle Lid */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-[#2A4830] rounded-t-2xl flex items-center justify-center">
                      <div className="w-10 h-1.5 bg-[#4B7955] rounded-full" />
                    </div>

                    {/* Scale tick marks on bottle */}
                    <div className="absolute top-10 right-2 flex flex-col gap-3 text-[10px] font-mono text-[#5C7E63] font-bold">
                      <span className="border-r-4 border-[#5C7E63] pr-1">200ml</span>
                      <span className="border-r-2 border-[#5C7E63]/60 pr-1">150ml</span>
                      <span className="border-r-2 border-[#5C7E63]/60 pr-1">100ml</span>
                    </div>

                    {/* Saengsik Drink Liquid */}
                    <div className="w-full h-36 bg-gradient-to-t from-[#8E9B7A] via-[#A8B594] to-[#BDC8AB] rounded-2xl p-3 relative flex flex-col justify-between shadow-inner">
                      {/* Grain Specks texture */}
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#404D2E_1px,transparent_1px)] [background-size:8px_8px]" />
                      <div className="relative z-10 text-center">
                        <span className="inline-block px-2 py-0.5 bg-[#2A4830]/80 text-[#F9FAF8] text-[11px] font-bold rounded">
                          고소한 한끼
                        </span>
                      </div>
                      <div className="relative z-10 text-center text-xs font-black text-[#1E3019]">
                        자연 생식 200ml
                      </div>
                    </div>
                  </div>

                  {/* Decorative Pouch beside bottle */}
                  <div className="absolute -bottom-1 -left-4 w-20 h-36 bg-[#EBE4D5] rounded-xl border-2 border-[#3D6645] shadow-lg transform -rotate-12 flex flex-col items-center justify-between p-2">
                    <span className="text-[9px] font-bold text-[#3D6645]">하루한잔</span>
                    <div className="text-center">
                      <p className="text-[11px] font-black text-[#2A4830]">50곡</p>
                      <p className="text-[9px] text-[#696357]">자연생식</p>
                    </div>
                    <span className="text-[8px] bg-[#3D6645] text-white px-1.5 py-0.5 rounded font-mono">1포 30g</span>
                  </div>

                </div>

                {/* Ingredients Ring Badges */}
                <div className="mt-4 w-full flex items-center justify-around text-xs font-bold text-[#444038] pt-3 border-t border-[#D5CBB9]">
                  <span className="flex items-center gap-1">🌾 현미·검정콩</span>
                  <span className="flex items-center gap-1">🥬 케일·시금치</span>
                  <span className="flex items-center gap-1">🎃 단호박·연근</span>
                </div>
              </div>

              {/* Special Tag Box */}
              <div className="mt-5 bg-[#EFE9DD] rounded-xl p-4 border border-[#DACFBE] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#3D6645] block">오늘 주문 시 혜택</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#23201B]">친환경 전용 보틀 무료 증정</span>
                </div>
                <button
                  onClick={onOpenOrder}
                  className="px-4 py-2 bg-[#2A4830] text-white font-bold text-sm rounded-lg hover:bg-[#1E3723] transition-colors"
                >
                  주문 이동
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
