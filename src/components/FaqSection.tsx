import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: '생식과 선식은 어떻게 다른가요?',
    answer: '선식은 주로 곡물을 볶거나 열을 가해 쪄서 가루 낸 식품인 반면, 생식은 열을 가하지 않고 영하 40도에서 급속 동결건조한 식품입니다. 원재료 고유의 신선한 색과 영양소를 열 손상 없이 자연 그대로 온전히 섭취할 수 있는 점이 가장 큰 특징입니다.'
  },
  {
    question: '맛이 쓰거나 떫지 않나요? 어떤 맛인가요?',
    answer: '설탕이나 합성 착향료는 전혀 들어있지 않지만, 현미·찹쌀·검정콩 등 고소한 통곡물과 단호박·당근 등 자연 채소가 조화롭게 배합되어 텁텁하지 않고 담백하며 은은한 고소함을 느끼실 수 있습니다. 처음 드시는 분은 우유나 두유에 타서 드시면 더욱 부드럽습니다.'
  },
  {
    question: '보관 방법과 유통기한은 어떻게 되나요?',
    answer: '직사광선과 고온다습한 곳을 피해 서늘한 실온(또는 냉장)에 보관해 주세요. 1포씩 질소 충전 개별 스틱 포장되어 있어 공기와 습기를 완벽히 차단하며, 제조일로부터 12개월간 신선하게 즐기실 수 있습니다.'
  },
  {
    question: '뜨거운 물이나 따뜻한 우유에 타도 되나요?',
    answer: '동결건조된 자연 원료의 신선함을 위해 미지근한 물이나 시원한 물, 차가운 우유/두유에 타서 드시는 것을 가장 권장합니다. 찬물에도 미세 분말이 뭉침 없이 부드럽게 잘 풀립니다.'
  },
  {
    question: '하루에 얼마나 먹는 것이 적당한가요?',
    answer: '순수 일반 식품(가공식품)이므로 정해진 제한 없이 자유롭게 식사 대용으로 드실 수 있습니다. 보통 바쁜 아침 식사로 1포, 혹은 식사를 제때 챙기기 어려운 저녁이나 든든한 간식으로 1~2포 권장해 드립니다.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F0] border-b border-[#E3DC CE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#3D6645]">
            <HelpCircle className="w-5 h-5" />
            <span>궁금한 점을 미리 확인하세요</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1F3A24] tracking-tight">
            자주 묻는 질문 (FAQ)
          </h2>
          <p className="text-base sm:text-lg text-[#5F594D]">
            정직한 재료와 보관 및 섭취 방법에 대한 안내입니다.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.question}
                className="bg-white rounded-2xl border border-[#DFD7C7] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F2] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg sm:text-xl font-bold text-[#23201A]">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#EFE9DC] text-[#2A4830] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 bg-[#2A4830] text-white' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-base sm:text-lg text-[#554F44] leading-relaxed border-t border-[#F2EDE2] bg-[#FAF8F2]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
