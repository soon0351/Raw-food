import React, { useState } from 'react';
import { ShoppingBag, Truck, Gift, ShieldCheck, Check, Plus, Minus } from 'lucide-react';
import { ProductOption } from '../types.ts';

interface ProductOrderSectionProps {
  onOpenOrder: (optionId?: string, qty?: number) => void;
}

export const ProductOrderSection: React.FC<ProductOrderSectionProps> = ({ onOpenOrder }) => {
  const [selectedPack, setSelectedPack] = useState<number>(1); // 1, 2, or 3 boxes
  const [quantity, setQuantity] = useState<number>(1);

  // Pricing matrix
  const bundleOptions: Record<number, { title: string; pricePerBox: number; totalPrice: number; discount: string; giftText: string }> = {
    1: {
      title: '1박스 (30포 / 1개월분)',
      pricePerBox: 45000,
      totalPrice: 45000,
      discount: '정가 59,000원 ➔ 45,000원 (24% 할인)',
      giftText: '친환경 트라이탄 쉐이커 보틀 1개 무료 증정'
    },
    2: {
      title: '2박스 (60포 / 2개월분) [인기]',
      pricePerBox: 42500,
      totalPrice: 85000,
      discount: '정가 118,000원 ➔ 85,000원 (33,000원 절약)',
      giftText: '쉐이커 보틀 1개 + 무료배송'
    },
    3: {
      title: '3박스 (90포 / 3개월분) [알뜰]',
      pricePerBox: 40000,
      totalPrice: 120000,
      discount: '정가 177,000원 ➔ 120,000원 (57,000원 절약)',
      giftText: '쉐이커 보틀 2개 증정 + 무료배송'
    }
  };

  const currentBundle = bundleOptions[selectedPack];
  const finalPrice = currentBundle.totalPrice * quantity;

  const handleOrder = () => {
    onOpenOrder(`box-${selectedPack}`, quantity);
  };

  return (
    <section id="order-section" className="py-16 sm:py-24 bg-[#F5F0E4] border-b border-[#E3DC CE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-base sm:text-lg font-extrabold text-[#3D6645] block">
            간편한 하루를 선물하세요
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3A24] tracking-tight">
            하루한잔 자연생식 주문하기
          </h2>
          <p className="text-lg sm:text-xl text-[#5E594F] font-medium leading-relaxed">
            국내산 50가지 곡물과 채소를 담은 순수 한 끼. 전국 무료배송으로 빠르게 보내드립니다.
          </p>
        </div>

        {/* Major Single Product Purchase Module */}
        <div className="mt-12 bg-white rounded-3xl border-2 border-[#DCD3C1] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Product Visual Showcase */}
          <div className="lg:col-span-5 bg-[#FAF6EE] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#E3DCCE] flex flex-col justify-between items-center text-center">
            
            {/* Visual Box & Pouch Composition */}
            <div className="w-full py-4 flex flex-col items-center justify-center">
              
              <div className="relative w-56 h-64 bg-gradient-to-b from-[#EFE8D9] to-[#DFD6C2] rounded-3xl border-4 border-[#2A4830]/20 shadow-md p-5 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#2A4830] text-white text-xs font-bold rounded-md">
                    국내산 100%
                  </span>
                  <span className="text-xs font-black text-[#4B6B4C]">동결건조</span>
                </div>

                <div className="text-center my-auto space-y-1">
                  <span className="text-xs font-bold text-[#6B6557]">정직한 식사 대용식</span>
                  <h3 className="text-2xl font-black text-[#1E3723] tracking-tight">
                    하루한잔 <br />자연생식
                  </h3>
                  <p className="text-xs font-semibold text-[#544F43]">50곡채소 한끼</p>
                </div>

                <div className="bg-white/80 rounded-xl p-2 text-center text-xs font-bold text-[#2A4830] border border-[#C5BBA6]">
                  30g × 30포 (1개월분)
                </div>
              </div>

              {/* Gift Badge Callout */}
              <div className="mt-6 w-full bg-[#E8EFE5] border border-[#C8DAC3] rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#2A4830] text-white flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A4830] block">구매 전원 증정 사은품</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#1E3723]">
                    친환경 전용 쉐이커 보틀 무료 증정
                  </span>
                </div>
              </div>

            </div>

            {/* Product Quick Specs */}
            <div className="w-full border-t border-[#DFD8CA] pt-4 mt-2 text-left space-y-2 text-sm text-[#666053]">
              <div className="flex justify-between">
                <span>식품유형</span>
                <span className="font-bold text-[#2A261F]">기타가공품 (생식분말)</span>
              </div>
              <div className="flex justify-between">
                <span>원산지</span>
                <span className="font-bold text-[#2A4830]">대한민국 (100% 국산 원료 50종)</span>
              </div>
              <div className="flex justify-between">
                <span>배송안내</span>
                <span className="font-bold text-[#2A261F]">우체국 무료배송 (익일 도착)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Quantity & Large Buy Button */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              {/* Product Title & Short Bio */}
              <div>
                <span className="text-sm font-bold text-[#3D6645] bg-[#E8EFE5] px-3 py-1 rounded-md">
                  정직한 식사 대용식
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1E3723] mt-2 leading-tight">
                  하루한잔 50곡채소 자연생식 (30포)
                </h3>
                <p className="text-base text-[#615C51] mt-1">
                  물이나 우유에 타서 간편하게 즐기는 50가지 국내산 자연 곡물과 채소
                </p>
              </div>

              {/* Price Highlight */}
              <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#DFD7C6]">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#2A4830] tracking-tight">
                    45,000원
                  </span>
                  <span className="text-lg sm:text-xl text-[#968F80] line-through font-semibold">
                    59,000원
                  </span>
                  <span className="text-sm font-extrabold text-[#C2410C] bg-[#FFEDD5] px-2 py-0.5 rounded">
                    24% 할인
                  </span>
                </div>
                <div className="text-sm text-[#615C52] mt-1 font-medium">
                  1포당 약 1,500원 · 커피 한 잔보다 저렴한 든든한 식사
                </div>
              </div>

              {/* Package Size Bundle Selector */}
              <div className="space-y-2">
                <label className="text-base font-extrabold text-[#2F2B24] block">
                  구성 선택
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedPack(num)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        selectedPack === num
                          ? 'border-[#2A4830] bg-[#E8EFE5]/40 text-[#1F3724]'
                          : 'border-[#DFD7C6] bg-white text-[#555045] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#3D6645]">
                        {num === 1 ? '1개월' : num === 2 ? '2개월' : '3개월'}
                      </div>
                      <div className="text-base font-extrabold mt-0.5">
                        {num}박스 ({num * 30}포)
                      </div>
                      <div className="text-xs font-bold mt-1 text-[#2A4830]">
                        {bundleOptions[num].totalPrice.toLocaleString()}원
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-bold text-[#332F27]">주문 수량</span>
                <div className="flex items-center border-2 border-[#D8CEBC] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#4A453B] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
                    aria-label="수량 감소"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-lg font-black text-[#221F1A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-[#4A453B] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
                    aria-label="수량 증가"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#6E685C] block">총 결제 금액 (무료배송)</span>
                  <span className="text-xs text-[#3D6645] font-semibold">{currentBundle.giftText}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#2A4830] tracking-tight">
                  {finalPrice.toLocaleString()}원
                </div>
              </div>
            </div>

            {/* Giant Order Button */}
            <div className="pt-2">
              <button
                onClick={handleOrder}
                className="w-full py-5 px-8 text-xl sm:text-2xl font-black text-white bg-[#2A4830] hover:bg-[#1C3621] active:scale-98 rounded-2xl shadow-xl shadow-[#2A4830]/25 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <ShoppingBag className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>주문하기</span>
              </button>
              
              <div className="mt-3 flex items-center justify-center gap-4 text-xs sm:text-sm text-[#736D61] font-medium">
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-[#3D6645]" />
                  평일 오후 2시 이전 주문 시 당일 발송
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#3D6645]" />
                  100% 국산 원료 안심 보장
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
