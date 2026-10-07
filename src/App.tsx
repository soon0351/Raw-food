/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { IngredientsSection } from './components/IngredientsSection.tsx';
import { TargetAudienceSection } from './components/TargetAudienceSection.tsx';
import { HowToDrinkSection } from './components/HowToDrinkSection.tsx';
import { ProductOrderSection } from './components/ProductOrderSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { OrderModal } from './components/OrderModal.tsx';
import { OrderManagementView } from './components/OrderManagementView.tsx';
import { OrderLookupModal } from './components/OrderLookupModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { MobileStickyCta } from './components/MobileStickyCta.tsx';
import { 
  subscribeToOrders, 
  createOrderInDb, 
  getOrdersFromDb,
  auth,
  signOutUser
} from './firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { OrderRecord } from './types.ts';

export default function App() {
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [currentUser, setCurrentUser] = useState<{ name: string; email?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [pendingOrder, setPendingOrder] = useState<{ optionId: string; qty: number } | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState<string>('box-1');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const displayName = user.displayName || user.email?.split('@')[0] || '스테판';
        setCurrentUser({
          name: displayName,
          email: user.email || undefined
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Subscribe to real-time orders in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });

    // Seed test order if database is empty
    const checkAndSeed = async () => {
      try {
        const existing = await getOrdersFromDb();
        if (existing.length === 0) {
          await createOrderInDb({
            orderNumber: `ORD-20261007-8421`,
            customerName: '권순택',
            phone: '01054025823',
            address: '대전 법동 동춘당로 151',
            detailAddress: '102-904',
            requestNote: '부재 시 문 앞에 놓아주세요',
            paymentMethod: '카카오페이(연습용)',
            optionId: 'box-1',
            optionTitle: '1박스 (30포 / 1개월분)',
            quantity: 1,
            unitPrice: 45000,
            totalPrice: 45000,
            status: '접수완료',
            createdAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('Initial seed error:', e);
      }
    };
    checkAndSeed();

    return () => unsubscribe();
  }, []);

  // When order button is clicked: require login/signup first
  const handleOpenOrder = (optionId: string = 'box-1', qty: number = 1) => {
    setSelectedOption(optionId);
    setSelectedQty(qty);

    if (!currentUser) {
      setPendingOrder({ optionId, qty });
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      setIsOrderModalOpen(true);
    }
  };

  const handleAuthSuccess = (userName: string) => {
    setCurrentUser(prev => prev || { name: userName });
    setIsAuthModalOpen(false);

    // If customer was trying to place an order, open the order sheet right away!
    if (pendingOrder) {
      setSelectedOption(pendingOrder.optionId);
      setSelectedQty(pendingOrder.qty);
      setPendingOrder(null);
      setIsOrderModalOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  const handleScrollToExplore = () => {
    if (viewMode !== 'store') {
      setViewMode('store');
      setTimeout(() => {
        const el = document.getElementById('ingredients');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById('ingredients');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#2C2925] font-sans">
      {/* Top Navigation */}
      <Header 
        onOpenOrder={() => handleOpenOrder('box-1', 1)}
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
        orderCount={orders.length}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        currentView={viewMode}
        onSwitchView={(v) => setViewMode(v)}
      />

      {/* Main Content: Store or Seller Order Management View */}
      {viewMode === 'admin' ? (
        <OrderManagementView onBackToStore={() => setViewMode('store')} />
      ) : (
        <main className="flex-1">
          {/* 1. Hero: "하루한잔, 간편한 한끼" + 큰 주문하기 버튼 */}
          <Hero
            onOpenOrder={() => handleOpenOrder('box-1', 1)}
            onExploreClick={handleScrollToExplore}
          />

          {/* 2. 국내산 50가지 곡물, 채소 소개 */}
          <IngredientsSection />

          {/* 3. 이런분께 좋아요 (3가지 추천) */}
          <TargetAudienceSection
            onOpenOrder={() => handleOpenOrder('box-1', 1)}
          />

          {/* 4. 물이나 우유에 타서 드세요 (1 -> 2 -> 3 순서 표시) */}
          <HowToDrinkSection />

          {/* 5. 상품 1개와 가격, 주문하기 버튼 */}
          <ProductOrderSection
            onOpenOrder={(opt, qty) => handleOpenOrder(opt || 'box-1', qty || 1)}
          />

          {/* 6. 자주 묻는 질문 */}
          <FaqSection />
        </main>
      )}

      {/* Footer & General Food Statutory Notice */}
      <Footer />

      {/* Mobile Sticky CTA Bar (Only in store view) */}
      {viewMode === 'store' && !isOrderModalOpen && !isLookupModalOpen && !isAuthModalOpen && (
        <MobileStickyCta onOpenOrder={() => handleOpenOrder('box-1', 1)} />
      )}

      {/* Sign Up & Login Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingOrder(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Customer Order & Checkout Dialog */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialOption={selectedOption}
        initialQty={selectedQty}
        defaultCustomerName={currentUser?.name || ''}
      />

      {/* Customer Order Lookup Dialog */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />
    </div>
  );
}
