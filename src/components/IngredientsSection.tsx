import React, { useState } from 'react';
import { Sprout, ShieldCheck, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';
import { IngredientCategory } from '../types.ts';

const CATEGORIES: IngredientCategory[] = [
  {
    title: '자연 통곡물',
    count: 18,
    icon: '🌾',
    description: '껍질째 갈아 곡물 고유의 고소함과 든든함을 전하는 국내산 통곡물',
    items: [
      '현미', '발아현미', '찰흑미', '찹쌀', '늘보리', '찰보리', 
      '귀리', '율무', '수수', '기장', '차조', '백태(대두)', 
      '서리태', '쥐눈이콩', '적두(팥)', '녹두', '메밀', '통밀'
    ]
  },
  {
    title: '제철 밭채소',
    count: 16,
    icon: '🥬',
    description: '신선한 토양에서 수확하여 깨끗하게 손질 후 동결건조한 제철 채소',
    items: [
      '케일', '신선초', '시금치', '양배추', '브로콜리', '미나리', 
      '신선배추', '당근', '단호박', '연근', '우엉', '무', 
      '비트', '토마토', '가지', '파프리카'
    ]
  },
  {
    title: '버섯 & 해조류',
    count: 8,
    icon: '🍄',
    description: '청정 바다와 자연목에서 채취한 깊은 풍미의 버섯과 해조류',
    items: [
      '표고버섯', '느타리버섯', '영지버섯', '팽이버섯', 
      '완도 미역', '기장 다시마', '신안 김', '완도 톳'
    ]
  },
  {
    title: '씨앗류 & 뿌리',
    count: 8,
    icon: '🌰',
    description: '풍부한 식감과 은은한 고소함을 더해주는 자연 씨앗과 뿌리',
    items: [
      '참깨', '들깨', '호박씨', '해바라기씨', 
      '더덕', '도라지', '생강', '연자육'
    ]
  }
];

export const IngredientsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section id="ingredients" className="py-16 sm:py-24 bg-[#FAF7F0] border-b border-[#E3DC CE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#3D6645] tracking-wide">
            <Sprout className="w-5 h-5" />
            <span>오직 정직한 땅에서 자란 우리 농산물</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3A24] tracking-tight leading-tight">
            국내산 50가지 곡물과 채소, <br />
            자연 그대로 한 포에
          </h2>

          <p className="text-lg sm:text-xl text-[#5E594F] font-medium leading-relaxed">
            원산지가 불분명한 원료는 단 1g도 섞지 않았습니다. <br className="hidden sm:inline" />
            전국 각지의 계약 재배 농가에서 수확한 50가지 자연 원료만을 정직하게 담았습니다.
          </p>
        </div>

        {/* 3 Core Production Commitments */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E3DCCE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8EFE5] text-[#2A4830] flex items-center justify-center font-black text-xl">
              100%
            </div>
            <h3 className="text-xl font-bold text-[#203724]">전 원료 국내산</h3>
            <p className="text-[#656054] text-base leading-relaxed">
              모든 곡물과 채소, 해조류는 대한민국 청정 지역에서 재배된 100% 국내산 원료만을 고집합니다.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E3DCCE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8EFE5] text-[#2A4830] flex items-center justify-center font-black text-xl">
              -40℃
            </div>
            <h3 className="text-xl font-bold text-[#203724]">급속 동결건조 공법</h3>
            <p className="text-[#656054] text-base leading-relaxed">
              고온의 열을 가하지 않고 영하 40도 이하에서 수분만 건조시켜 자연 고유의 신선한 색과 영양소를 지킵니다.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E3DCCE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8EFE5] text-[#2A4830] flex items-center justify-center font-black text-xl">
              0%
            </div>
            <h3 className="text-xl font-bold text-[#203724]">4대 무첨가 원칙</h3>
            <p className="text-[#656054] text-base leading-relaxed">
              설탕, 보존료(방부제), 합성착향료, 인공색소를 전혀 넣지 않아 재료 고유의 순수하고 은은한 단맛과 고소함이 납니다.
            </p>
          </div>
        </div>

        {/* 50 Ingredients Interactive Browser */}
        <div className="mt-12 bg-[#F3EFE6] rounded-3xl p-6 sm:p-8 border border-[#DFD8CA]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DACFBD] gap-3">
            <div>
              <h3 className="text-2xl font-black text-[#1F3A24]">50가지 원재료 상세 목록</h3>
              <p className="text-[#666054] text-base mt-1">탭을 선택하여 50가지 원료를 모두 확인하실 수 있습니다.</p>
            </div>
            <div className="text-lg font-extrabold text-[#2A4830] bg-[#E5ECE0] px-4 py-2 rounded-xl self-start sm:self-auto">
              총 50종 자연식물류
            </div>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat.title}
                onClick={() => setActiveTab(idx)}
                className={`p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer border ${
                  activeTab === idx
                    ? 'bg-[#2A4830] text-white border-[#2A4830] shadow-md'
                    : 'bg-[#FAF7F0] text-[#47433B] border-[#DACFBD] hover:bg-[#EFE9DC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{cat.icon}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeTab === idx ? 'bg-white/20 text-white' : 'bg-[#E7DFC F] text-[#555045]'
                  }`}>
                    {cat.count}종
                  </span>
                </div>
                <div className="font-extrabold text-base sm:text-lg mt-2">{cat.title}</div>
              </button>
            ))}
          </div>

          {/* Active Category Content */}
          <div className="mt-6 bg-[#FAF7F0] rounded-2xl p-6 sm:p-7 border border-[#DFD8CA]">
            <div className="mb-4">
              <h4 className="text-xl font-bold text-[#2A4830] flex items-center gap-2">
                <span>{CATEGORIES[activeTab].icon}</span>
                <span>{CATEGORIES[activeTab].title} ({CATEGORIES[activeTab].count}종)</span>
              </h4>
              <p className="text-base text-[#676156] mt-1">{CATEGORIES[activeTab].description}</p>
            </div>

            {/* Ingredient Items Grid (Large, legible chips) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CATEGORIES[activeTab].items.map((item) => (
                <div
                  key={item}
                  className="bg-white px-4 py-3 rounded-xl border border-[#E3DCCE] flex items-center gap-2 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#3D6645] shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-[#2C2924]">{item}</span>
                  <span className="text-xs text-[#827D72] ml-auto">국산</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Notice */}
          <div className="mt-6 text-center text-sm sm:text-base text-[#706B5F] font-medium">
            ※ 원재료명 및 함량은 제품 포장지 후면에 상세히 투명하게 기재되어 있습니다.
          </div>

        </div>

      </div>
    </section>
  );
};
