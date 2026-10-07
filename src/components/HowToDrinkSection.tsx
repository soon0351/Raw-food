import React, { useState } from 'react';
import { Droplets, Milk, Sparkles, Check, ArrowRight } from 'lucide-react';

export const HowToDrinkSection: React.FC = () => {
  const [selectedMix, setSelectedMix] = useState<'water' | 'milk' | 'soymilk'>('water');

  const mixDetails = {
    water: {
      name: '물 (생수 200ml)',
      badge: '가장 깔끔하고 순수한 맛',
      description: '50가지 곡물과 채소 본연의 맑고 담백한 맛을 그대로 느끼고 싶을 때 가장 추천합니다. 목넘김이 가볍고 개운합니다.',
      color: 'bg-blue-50 text-blue-900 border-blue-200'
    },
    milk: {
      name: '우유 (200ml)',
      badge: '더욱 부드럽고 고소한 맛',
      description: '고소한 우유와 만나 미숫가루나 곡물 라떼처럼 크리미하고 부드러운 풍미를 냅니다. 속을 더욱 포근하고 든든하게 채워줍니다.',
      color: 'bg-amber-50 text-amber-900 border-amber-200'
    },
    soymilk: {
      name: '두유 (200ml)',
      badge: '진하고 든든한 포만감',
      description: '콩의 깊은 고소함이 생식의 50가지 원료와 조화롭게 어우러집니다. 한 끼 식사로 오래가는 든든함을 원하실 때 좋습니다.',
      color: 'bg-stone-100 text-stone-900 border-stone-300'
    }
  };

  return (
    <section id="how-to-drink" className="py-16 sm:py-24 bg-[#FAF7F0] border-b border-[#E3DC CE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-base sm:text-lg font-extrabold text-[#3D6645] block">
            30초면 완성되는 간편 레시피
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3A24] tracking-tight">
            물이나 우유에 타서 드세요
          </h2>
          <p className="text-lg sm:text-xl text-[#5B564C] font-medium leading-relaxed">
            순서만 지켜주시면 뭉침 없이 부드럽고 고소하게 즐기실 수 있습니다.
          </p>
        </div>

        {/* 1 -> 2 -> 3 Sequential Cards with Arrows */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* STEP 1 */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#DED6C6] flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#2A4830] text-white font-black text-2xl flex items-center justify-center shadow-md">
                  1
                </span>
                <span className="text-sm font-bold text-[#3D6645] bg-[#E8EFE5] px-3 py-1 rounded-full">
                  STEP 01
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#203724] leading-snug">
                보틀에 물이나 우유 <br />
                <span className="text-[#2A4830]">200ml 먼저 붓기</span>
              </h3>

              <p className="text-base sm:text-lg text-[#555046] font-medium leading-relaxed">
                가루를 먼저 넣지 마시고 <strong className="text-[#2A4830]">액체(물, 우유, 두유)를 먼저</strong> 보틀에 부어주세요. 바닥에 가루가 뭉치지 않는 황금 비결입니다.
              </p>
            </div>

            {/* Visual Mini Diagram for Step 1 */}
            <div className="mt-6 pt-4 border-t border-[#EDE8DC] flex items-center gap-3 text-sm text-[#706B5F]">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FA] flex items-center justify-center text-blue-700 font-bold">
                💧
              </div>
              <div>
                <span className="font-bold text-[#332F28] block">권장 용량 : 200ml</span>
                <span>취향에 따라 180~220ml 조절 가능</span>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#DED6C6] flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#2A4830] text-white font-black text-2xl flex items-center justify-center shadow-md">
                  2
                </span>
                <span className="text-sm font-bold text-[#3D6645] bg-[#E8EFE5] px-3 py-1 rounded-full">
                  STEP 02
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#203724] leading-snug">
                하루한잔 생식 <br />
                <span className="text-[#2A4830]">1포(30g) 넣기</span>
              </h3>

              <p className="text-base sm:text-lg text-[#555046] font-medium leading-relaxed">
                손으로 가볍게 뜯어지는 이지컷 스틱 포장입니다. 가루 날림 없이 보틀 입구에 톡 털어 넣어주세요.
              </p>
            </div>

            {/* Visual Mini Diagram for Step 2 */}
            <div className="mt-6 pt-4 border-t border-[#EDE8DC] flex items-center gap-3 text-sm text-[#706B5F]">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE3] flex items-center justify-center text-[#735A2F] font-bold">
                🌾
              </div>
              <div>
                <span className="font-bold text-[#332F28] block">개별 위생 스틱 1포</span>
                <span>언제 어디서나 간편 휴대 가능</span>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#DED6C6] flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#2A4830] text-white font-black text-2xl flex items-center justify-center shadow-md">
                  3
                </span>
                <span className="text-sm font-bold text-[#3D6645] bg-[#E8EFE5] px-3 py-1 rounded-full">
                  STEP 03
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#203724] leading-snug">
                가볍게 5초간 흔들어 <br />
                <span className="text-[#2A4830]">고소하게 마시기</span>
              </h3>

              <p className="text-base sm:text-lg text-[#555046] font-medium leading-relaxed">
                뚜껑을 닫고 위아래로 3~5회 가볍게 흔들면 부드럽게 풀립니다. 천천히 씹듯이 음미하시면 고소함이 배가됩니다.
              </p>
            </div>

            {/* Visual Mini Diagram for Step 3 */}
            <div className="mt-6 pt-4 border-t border-[#EDE8DC] flex items-center gap-3 text-sm text-[#706B5F]">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE5] flex items-center justify-center text-[#2A4830] font-bold">
                ✨
              </div>
              <div>
                <span className="font-bold text-[#332F28] block">5초 흔들면 끝</span>
                <span>미세 동결분말로 찬물에도 부드럽게 분산</span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Combination Guide */}
        <div className="mt-12 bg-[#F1ECE0] rounded-3xl p-6 sm:p-8 border border-[#DACFBE]">
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-2xl font-black text-[#1F3A24]">취향에 맞는 추천 조합을 골라보세요</h3>
            <p className="text-base text-[#615C52] mt-1">버튼을 누르면 각 음료별 맛의 특징을 확인하실 수 있습니다.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedMix('water')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                selectedMix === 'water'
                  ? 'bg-white border-[#2A4830] shadow-md'
                  : 'bg-[#FBF9F5] border-[#DED6C6] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-lg text-[#1F3A24]">
                <span>💧</span>
                <span>깔끔한 물 (생수)</span>
              </div>
              <div className="text-xs font-bold text-[#556F59] mt-1">원재료 본연의 담백한 맛</div>
            </button>

            <button
              onClick={() => setSelectedMix('milk')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                selectedMix === 'milk'
                  ? 'bg-white border-[#2A4830] shadow-md'
                  : 'bg-[#FBF9F5] border-[#DED6C6] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-lg text-[#1F3A24]">
                <span>🥛</span>
                <span>고소한 우유</span>
              </div>
              <div className="text-xs font-bold text-[#556F59] mt-1">부드러운 곡물 라떼 풍미</div>
            </button>

            <button
              onClick={() => setSelectedMix('soymilk')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                selectedMix === 'soymilk'
                  ? 'bg-white border-[#2A4830] shadow-md'
                  : 'bg-[#FBF9F5] border-[#DED6C6] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-lg text-[#1F3A24]">
                <span>🌱</span>
                <span>진한 두유</span>
              </div>
              <div className="text-xs font-bold text-[#556F59] mt-1">풍성하고 든든한 포만감</div>
            </button>
          </div>

          {/* Result card */}
          <div className="mt-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#DED6C6]">
            <div className="flex items-center gap-2 font-bold text-base text-[#2A4830]">
              <Check className="w-5 h-5 text-[#3D6645]" />
              <span>{mixDetails[selectedMix].name} — {mixDetails[selectedMix].badge}</span>
            </div>
            <p className="mt-2 text-base sm:text-lg text-[#47433B] leading-relaxed">
              {mixDetails[selectedMix].description}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
