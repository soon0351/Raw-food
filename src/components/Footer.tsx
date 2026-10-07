import React from 'react';
import { ShieldCheck, Phone, Clock, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#213725] text-[#DCE5DC] pt-14 pb-24 sm:pb-16 border-t border-[#192B1D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Statutory General Food Notice (Required) */}
        <div className="bg-[#182C1B] rounded-2xl p-5 border border-[#2F4D33] text-sm text-[#ABC1AC] leading-relaxed">
          <strong className="text-white block mb-1">식품위생법 및 표시광고법에 따른 안내 문구</strong>
          본 제품은 질병의 예방 및 치료를 위한 의약품이나 건강기능식품이 아닌, 100% 국내산 자연 곡물과 채소를 동결건조하여 분말화한 일반가공식품(생식류)입니다. 원재료 고유의 정직한 맛과 간편한 식사 대용으로 안심하고 섭취하실 수 있습니다.
        </div>

        {/* 3 Columns: Brand & Support & Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#406846] text-white flex items-center justify-center text-xs font-black">
                生
              </span>
              하루한잔 자연생식
            </h3>
            <p className="text-sm text-[#B4C7B5] leading-relaxed">
              자연이 주는 50가지 순수 원료를 그대로 담아, <br />
              바쁜 현대인에게 정직하고 건강한 한 끼를 전합니다.
            </p>
            <div className="text-xs text-[#8FA591] pt-2 space-y-1">
              <div>상호명: (주)하루한잔자연식품 · 대표: 정자연</div>
              <div>사업자등록번호: 123-45-67890 · 통신판매업: 제2026-서울-0123호</div>
              <div>소재지: 충청북도 충주시 신니면 곡물로 50 가공센터</div>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#86B489]" />
              고객만족센터
            </h4>
            <div className="text-2xl sm:text-3xl font-black text-[#B8E2BA]">
              1588-5050
            </div>
            <div className="text-xs sm:text-sm text-[#B4C7B5] space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#86B489]" />
                평일 09:00 ~ 18:00 (점심시간 12:00~13:00)
              </div>
              <div>주말 및 공휴일 휴무 · 카카오톡 플러스친구 상담 가능</div>
            </div>
          </div>

          {/* Shipping & Return Trust */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#86B489]" />
              안심 보증 서비스
            </h4>
            <ul className="text-xs sm:text-sm text-[#B4C7B5] space-y-2">
              <li>• 전국 우체국 택배 100% 무료배송</li>
              <li>• 신선 제조일 100% 보증 (최근 1개월 내 제조품만 출고)</li>
              <li>• 배송 중 파손 또는 이상 시 100% 무상 맞교환</li>
              <li>• 단체 주문 및 정기배송 문의 환영</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-[#29442C] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8AA18B] gap-3">
          <div>
            © 2026 하루한잔 자연생식 (All Rights Reserved).
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">원산지 증명서</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
