import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface MobileStickyCtaProps {
  onOpenOrder: () => void;
}

export const MobileStickyCta: React.FC<MobileStickyCtaProps> = ({ onOpenOrder }) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-t-2 border-[#DCD3C2] p-3 px-4 shadow-2xl flex items-center justify-between gap-3 h-[68px]">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[#554F45]">1박스 30포 (보틀 증정)</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black text-[#2A4830]">45,000원</span>
          <span className="text-[11px] font-bold text-[#8E8676] line-through">59,000원</span>
        </div>
      </div>

      <button
        onClick={onOpenOrder}
        className="flex-1 max-w-[170px] h-12 px-5 bg-[#2A4830] active:bg-[#1C3621] text-white font-extrabold text-base rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>주문하기</span>
      </button>
    </div>
  );
};
