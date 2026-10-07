import React from 'react';
import { ShoppingBag, Menu, X, Search, Settings, User, LogOut, LogIn, Store, ClipboardList } from 'lucide-react';

interface HeaderProps {
  onOpenOrder: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  orderCount?: number;
  currentUser: { name: string; email?: string } | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSignOut: () => void;
  currentView: 'store' | 'admin';
  onSwitchView: (view: 'store' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenOrder, 
  onOpenLookup, 
  onOpenAdmin,
  orderCount = 0,
  currentUser,
  onOpenAuth,
  onSignOut,
  currentView,
  onSwitchView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'store') {
      onSwitchView('store');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2D6] transition-all shadow-2xs">
      
      {/* Top Banner when Logged In: "스테판 님 환영합니다" */}
      {currentUser && (
        <div className="bg-[#2A4830] text-white py-1.5 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
          <span>🌿</span>
          <span className="text-white font-extrabold tracking-wide">
            {currentUser.name} 님 환영합니다!
          </span>
          <span className="text-white/60 hidden sm:inline">|</span>
          <span className="text-white/90 text-xs hidden sm:inline">
            오늘도 자연 생식으로 간편하고 든든한 하루 보내세요
          </span>
          <button
            onClick={onSignOut}
            className="ml-3 text-[11px] text-white/80 hover:text-white underline cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSwitchView('store')}
            className="flex items-center gap-2 group text-[#2A4830] font-extrabold text-xl sm:text-2xl tracking-tight cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-[#3D6645] text-white flex items-center justify-center text-sm font-black shadow-xs">
              生
            </span>
            <span className="group-hover:text-[#1B3521] transition-colors">
              하루한잔 자연생식
            </span>
          </button>

          {/* User Welcome Badge in Header (Desktop) */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#E8EFE5] text-[#2A4830] rounded-full text-xs font-black border border-[#CFDFC9]">
              <User className="w-3.5 h-3.5" />
              <span>{currentUser.name} 님 환영합니다</span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[16px] font-semibold text-[#544F46]">
          {currentView === 'store' ? (
            <>
              <button 
                onClick={() => scrollTo('ingredients')} 
                className="hover:text-[#2A4830] transition-colors cursor-pointer py-1"
              >
                국내산 50가지 원료
              </button>
              <button 
                onClick={() => scrollTo('recommendations')} 
                className="hover:text-[#2A4830] transition-colors cursor-pointer py-1"
              >
                이런 분께 추천
              </button>
              <button 
                onClick={() => scrollTo('how-to-drink')} 
                className="hover:text-[#2A4830] transition-colors cursor-pointer py-1"
              >
                간편한 섭취 방법
              </button>
              <button 
                onClick={() => scrollTo('order-section')} 
                className="hover:text-[#2A4830] transition-colors cursor-pointer py-1"
              >
                상품 안내
              </button>
              <button 
                onClick={onOpenLookup} 
                className="text-[#3D6645] hover:text-[#1F3724] font-bold flex items-center gap-1 transition-colors cursor-pointer py-1"
              >
                <Search className="w-4 h-4" />
                <span>주문 조회</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2A4830] bg-[#E8EFE5] px-3 py-1 rounded-full border border-[#BCD2B9]">
                판매자 주문관리 모드 실행 중
              </span>
            </div>
          )}
        </nav>

        {/* Zone 3: Primary Action, Auth & Order Management Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User Auth Button */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onSignOut}
                className="px-3 py-2 text-xs font-bold text-[#635D52] hover:text-[#2A4830] flex items-center gap-1 rounded-lg hover:bg-[#EFEAE0] transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-[#2A4830] bg-[#FAF7F0] hover:bg-[#EAE4D7] border border-[#D5CBB9] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인/회원가입</span>
            </button>
          )}

          {/* Prominent Order Management Toggle Button for the Seller */}
          {currentView === 'store' ? (
            <button
              onClick={() => onSwitchView('admin')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-[#1F3724] bg-[#E8EFE5] hover:bg-[#D5E4D0] border-2 border-[#2A4830]/40 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              title="판매자 전용 주문관리 표 화면으로 전환합니다"
            >
              <ClipboardList className="w-4 h-4 text-[#2A4830]" />
              <span>주문관리 (판매자)</span>
              {orderCount > 0 && (
                <span className="bg-[#2A4830] text-white text-[11px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {orderCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onSwitchView('store')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-white bg-[#2A4830] hover:bg-[#1C3621] rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              title="손님 쇼핑몰 소개 화면으로 돌아갑니다"
            >
              <Store className="w-4 h-4" />
              <span>쇼핑몰 화면</span>
            </button>
          )}

          {/* Customer Order Button (In Store View) */}
          {currentView === 'store' && (
            <button
              onClick={onOpenOrder}
              className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-base font-bold text-white bg-[#2A4830] hover:bg-[#1E3723] active:scale-98 rounded-xl shadow-md shadow-[#2A4830]/15 transition-all cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>주문하기</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-[#3D3A34] hover:bg-[#EFEAE0] transition-colors"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF9F5] border-b border-[#E7E2D6] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
          
          {/* Mobile User Profile Section */}
          <div className="p-3 mb-2 bg-[#EFEAE0] rounded-xl flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-black text-[#1E3723]">
                  <User className="w-5 h-5 text-[#2A4830]" />
                  <span>{currentUser.name} 님 환영합니다</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="text-xs text-[#706B5F] hover:text-[#2A4830] font-bold underline"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-[#4D483F]">로그인이 필요하신가요?</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="px-3 py-1.5 bg-[#2A4830] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  로그인 / 가입
                </button>
              </div>
            )}
          </div>

          {/* View Mode Switcher in Mobile Drawer */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#EBE4D5] rounded-xl mb-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSwitchView('store');
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all ${
                currentView === 'store' ? 'bg-[#2A4830] text-white shadow-xs' : 'text-[#4A453A]'
              }`}
            >
              🏪 쇼핑몰 화면
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSwitchView('admin');
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                currentView === 'admin' ? 'bg-[#2A4830] text-white shadow-xs' : 'text-[#4A453A]'
              }`}
            >
              <span>📋 주문관리</span>
              {orderCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {orderCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => scrollTo('ingredients')}
            className="w-full text-left py-3 px-3 text-lg font-semibold text-[#3D3A34] rounded-lg hover:bg-[#EFEAE0]"
          >
            국내산 50가지 곡물 & 채소
          </button>
          <button
            onClick={() => scrollTo('recommendations')}
            className="w-full text-left py-3 px-3 text-lg font-semibold text-[#3D3A34] rounded-lg hover:bg-[#EFEAE0]"
          >
            이런 분께 좋아요 (3가지)
          </button>
          <button
            onClick={() => scrollTo('how-to-drink')}
            className="w-full text-left py-3 px-3 text-lg font-semibold text-[#3D3A34] rounded-lg hover:bg-[#EFEAE0]"
          >
            물이나 우유에 타서 드세요 (순서)
          </button>
          <button
            onClick={() => scrollTo('order-section')}
            className="w-full text-left py-3 px-3 text-lg font-semibold text-[#3D3A34] rounded-lg hover:bg-[#EFEAE0]"
          >
            상품 구성 및 가격
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLookup();
            }}
            className="w-full text-left py-3 px-3 text-lg font-bold text-[#2A4830] rounded-lg bg-[#EAEFE6] flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>내 주문 내역 조회</span>
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder();
              }}
              className="w-full py-4 text-center text-lg font-bold text-white bg-[#2A4830] rounded-xl shadow-md"
            >
              지금 바로 주문하기
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
