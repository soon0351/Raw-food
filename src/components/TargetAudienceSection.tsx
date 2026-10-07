import React from 'react';
import { Sun, UtensilsCrossed, Leaf, ArrowRight } from 'lucide-react';

interface TargetAudienceSectionProps {
  onOpenOrder: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ onOpenOrder }) => {
  const recommendations = [
    {
      number: '01',
      title: '아침 식사를 자주 거르시는 분',
      icon: <Sun className="w-8 h-8 text-[#2A4830]" />,
      problem: '바쁜 출근길·등굣길, 빈속으로 나가기는 아쉽고 밥 차릴 시간은 없을 때',
      solution: '보틀에 담아 흔들면 30초 만에 완성! 출근길 차 안이나 대중교통, 사무실 책상에서도 부담 없이 든든하게 마실 수 있습니다.',
      highlight: '30초 완성 간편 아침'
    },
    {
      number: '02',
      title: '매 끼니 챙겨 먹기가 번거로운 분',
      icon: <UtensilsCrossed className="w-8 h-8 text-[#2A4830]" />,
      problem: '혼자 살거나 바쁜 일상 속 장보기, 요리, 뒷정리와 설거지가 부담스러울 때',
      solution: '생식 1포와 물이나 우유만 있으면 냄비도 불도 필요 없습니다. 마신 뒤 보틀만 헹구면 식사 준비와 뒷정리가 1분 만에 끝납니다.',
      highlight: '요리·설거지 없는 간편함'
    },
    {
      number: '03',
      title: '자연 곡물과 채소를 골고루 드시고 싶은 분',
      icon: <Leaf className="w-8 h-8 text-[#2A4830]" />,
      problem: '매일 시장에서 50가지 신선한 채소와 곡물을 따로 사서 챙겨 먹기 번거로울 때',
      solution: '국내산 50가지 통곡물, 뿌리채소, 녹황색 채소, 해조류를 영양 그대로 담아 한 잔으로 균형 있는 자연의 맛을 온전히 섭취합니다.',
      highlight: '50가지 자연 원료 한 잔 섭취'
    }
  ];

  return (
    <section id="recommendations" className="py-16 sm:py-24 bg-[#F5F1E8] border-b border-[#E3DC CE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-base sm:text-lg font-extrabold text-[#3D6645] block">
            간편함과 자연 원료가 필요한 순간
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3A24] tracking-tight">
            이런 분께 참 좋아요
          </h2>
          <p className="text-lg sm:text-xl text-[#5B564C] font-medium leading-relaxed">
            복잡한 준비 없이 정직한 재료로 간편하게 채우는 일상의 든든한 동반자입니다.
          </p>
        </div>

        {/* 3 Large Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((rec) => (
            <div
              key={rec.number}
              className="bg-[#FAF7F0] rounded-3xl p-7 sm:p-8 border-2 border-[#DED6C6] flex flex-col justify-between hover:border-[#3D6645] transition-all shadow-md group"
            >
              <div className="space-y-5">
                {/* Top Number & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8EFE5] flex items-center justify-center shadow-inner">
                    {rec.icon}
                  </div>
                  <span className="text-3xl font-black text-[#B0A795]/50 group-hover:text-[#3D6645]/40 transition-colors">
                    {rec.number}
                  </span>
                </div>

                {/* Card Title */}
                <div>
                  <h3 className="text-2xl sm:text-2xl font-black text-[#203724] leading-snug">
                    {rec.title}
                  </h3>
                  <div className="mt-2 inline-block bg-[#E5ECE0] text-[#2A4830] text-sm font-bold px-3 py-1 rounded-lg">
                    {rec.highlight}
                  </div>
                </div>

                {/* Situation & Solution */}
                <div className="space-y-3 pt-2">
                  <div className="bg-[#EFEAE0] p-4 rounded-xl text-base text-[#59544A] leading-relaxed">
                    <span className="font-bold text-[#35312B] block mb-1">상황 :</span>
                    {rec.problem}
                  </div>

                  <p className="text-base sm:text-lg text-[#3E3A33] font-medium leading-relaxed">
                    {rec.solution}
                  </p>
                </div>
              </div>

              {/* Bottom Touch Affirmation */}
              <div className="mt-6 pt-4 border-t border-[#DFD8CA] flex items-center text-[#2A4830] font-bold text-base">
                <span>자연 그대로 간편하게</span>
                <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Big Bottom Action in Target Section */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenOrder}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-xl font-extrabold text-white bg-[#2A4830] hover:bg-[#1E3723] active:scale-98 rounded-2xl shadow-lg shadow-[#2A4830]/20 transition-all cursor-pointer"
          >
            <span>나를 위한 간편한 한끼 주문하기</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
};
