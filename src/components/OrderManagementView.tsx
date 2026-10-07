import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  Truck, 
  RefreshCw, 
  Phone, 
  MapPin, 
  Filter, 
  Check, 
  ArrowLeft,
  Store,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { OrderRecord } from '../types.ts';
import { subscribeToOrders, updateOrderStatusInDb, createOrderInDb } from '../firebase.ts';

interface OrderManagementViewProps {
  onBackToStore: () => void;
}

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({ onBackToStore }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);

  // Real-time Firestore sync: updates automatically without page refresh!
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.optionTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter((o) => o.status === '접수완료').length;
  const shippingCount = orders.filter((o) => o.status === '배송중').length;
  const completedCount = orders.filter((o) => o.status === '배송완료').length;

  // Change status to "배송중" or "배송완료"
  const handleUpdateStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusInDb(orderId, newStatus);
      setJustUpdatedId(orderId);
      setTimeout(() => setJustUpdatedId(null), 1500);
    } catch (err) {
      console.error('Status update failed:', err);
      alert('상태 변경에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Add demo test order for instant verification
  const handleAddTestOrder = async () => {
    try {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const random4Digits = Math.floor(1000 + Math.random() * 9000);
      
      await createOrderInDb({
        orderNumber: `ORD-${dateStr}-${random4Digits}`,
        customerName: '스테판',
        phone: '010-9876-5432',
        address: '서울특별시 강남구 테헤란로 152',
        detailAddress: '자연빌딩 7층',
        requestNote: '도착 전 문자 부탁드립니다',
        paymentMethod: '카카오페이(연습용)',
        optionId: 'box-1',
        optionTitle: '1박스 (30포 / 1개월분)',
        quantity: 1,
        unitPrice: 45000,
        totalPrice: 45000,
        status: '접수완료',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Test order creation failed:', err);
    }
  };

  // CSV Export for Excel / courier
  const handleExportCsv = () => {
    if (orders.length === 0) {
      alert('다운로드할 주문 내역이 없습니다.');
      return;
    }

    const headers = ['주문번호', '주문일시', '주문자명', '연락처', '배송지', '상세주소', '요청사항', '상품명', '수량', '결제금액', '결제수단', '주문상태'];
    const rows = orders.map(o => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleString('ko-KR')}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.address}"`,
      `"${o.detailAddress || ''}"`,
      `"${o.requestNote || ''}"`,
      `"${o.optionTitle}"`,
      o.quantity,
      o.totalPrice,
      `"${o.paymentMethod}"`,
      `"${o.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `생식_주문목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F6F3EB] text-[#2C2925] pb-20">
      
      {/* Top Banner & Navigation */}
      <div className="bg-[#1F3724] text-white border-b border-[#16291A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#3D6645] flex items-center justify-center text-lg font-black shadow-inner">
              生
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  판매자 주문관리 시스템
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  실시간 자동 반영 중
                </span>
              </div>
              <p className="text-xs text-[#A7C2A9] mt-0.5">
                새 주문이 들어오면 새로고침 없이 화면 목록에 실시간으로 자동 표시됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddTestOrder}
              className="px-3.5 py-2 bg-[#2D4D33] hover:bg-[#3B6443] border border-[#487350] text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap text-[#E0EFE2]"
              title="새 주문이 들어오는 것을 바로 테스트합니다"
            >
              + 테스트 주문 넣기
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-[#FAF7F0] text-[#1F3724] hover:bg-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>엑셀 다운로드</span>
            </button>
            <button
              onClick={onBackToStore}
              className="px-4 py-2 bg-[#3D6645] hover:bg-[#4C7C55] text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Store className="w-4 h-4" />
              <span>쇼핑몰 화면 보기</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Quick Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DFD7C7] shadow-xs">
            <div className="text-xs font-bold text-[#756F63]">총 누적 주문</div>
            <div className="text-2xl sm:text-3xl font-black text-[#1E3723] mt-1">
              {orders.length}건
            </div>
            <div className="text-xs text-[#8C8476] mt-1">전체 들어온 주문 수</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DFD7C7] shadow-xs">
            <div className="text-xs font-bold text-[#756F63]">총 주문 금액</div>
            <div className="text-2xl sm:text-3xl font-black text-[#2A4830] mt-1">
              {totalSales.toLocaleString()}원
            </div>
            <div className="text-xs text-[#8C8476] mt-1">전액 무료배송 포함</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DFD7C7] shadow-xs">
            <div className="text-xs font-bold text-amber-700">신규 접수 대기</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {pendingCount}건
            </div>
            <div className="text-xs text-amber-700/80 mt-1">발송 준비가 필요한 주문</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DFD7C7] shadow-xs">
            <div className="text-xs font-bold text-blue-700">배송 중 / 완료</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {shippingCount} / {completedCount}건
            </div>
            <div className="text-xs text-blue-700/80 mt-1">배송 처리 완료 현황</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DFD7C7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `전체 (${orders.length})` },
              { id: '접수완료', label: `접수완료 (${pendingCount})` },
              { id: '배송중', label: `배송중 (${shippingCount})` },
              { id: '배송완료', label: `배송완료 (${completedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#2A4830] text-white shadow-xs'
                    : 'bg-[#F4EFE5] text-[#5A554A] hover:bg-[#EAE4D7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C8475] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="주문번호, 주문자명, 전화번호 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F3] rounded-xl border border-[#D5CBB9] text-sm focus:outline-none focus:border-[#2A4830] font-medium"
            />
          </div>

        </div>

        {/* Orders Table Display */}
        <div className="bg-white rounded-3xl border-2 border-[#DFD7C7] shadow-md overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              
              {/* Table Header: 주문번호, 주문자, 상품, 금액, 상태, 상태 변경 */}
              <thead>
                <tr className="bg-[#EDE6D7] text-[#413D34] text-xs sm:text-sm font-black border-b border-[#D8CEBD]">
                  <th className="py-4 px-5">주문번호 / 일시</th>
                  <th className="py-4 px-5">주문자 정보</th>
                  <th className="py-4 px-5">주문 상품</th>
                  <th className="py-4 px-5">결제 금액</th>
                  <th className="py-4 px-5">현재 상태</th>
                  <th className="py-4 px-5 text-center">상태 변경 버튼</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#EFEAE0] text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#706B5F]">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2A4830] mb-2" />
                      <p className="font-bold">실시간 주문 데이터를 불러오는 중입니다...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center space-y-3">
                      <ShoppingBag className="w-12 h-12 text-[#BDB5A4] mx-auto" />
                      <div className="text-lg font-bold text-[#3C3831]">
                        {searchTerm ? '검색된 주문 내역이 없습니다.' : '접수된 주문이 없습니다.'}
                      </div>
                      <p className="text-xs text-[#706B5F] max-w-sm mx-auto">
                        손님이 쇼핑몰에서 주문하거나, 상단의 "+ 테스트 주문 넣기"를 누르면 새로고침 없이 즉시 표에 추가됩니다.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isJustUpdated = justUpdatedId === order.id;
                    const isUpdating = updatingId === order.id;

                    return (
                      <tr 
                        key={order.id || order.orderNumber}
                        className={`hover:bg-[#FAF8F3] transition-colors ${
                          isJustUpdated ? 'bg-emerald-50' : ''
                        }`}
                      >
                        {/* 1. 주문번호 / 일시 */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-mono font-black text-[#1E3723] text-sm">
                            {order.orderNumber}
                          </div>
                          <div className="text-xs text-[#7C7567] mt-0.5">
                            {new Date(order.createdAt).toLocaleString('ko-KR', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>

                        {/* 2. 주문자 */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-black text-[#211E18] text-base">
                            {order.customerName}
                          </div>
                          <div className="text-xs font-bold text-[#2A4830] mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{order.phone}</span>
                          </div>
                          <div className="text-xs text-[#554F44] mt-1 max-w-[220px] leading-snug">
                            {order.address} {order.detailAddress}
                          </div>
                          {order.requestNote && (
                            <div className="text-[11px] text-[#7A7467] mt-0.5">
                              요청: {order.requestNote}
                            </div>
                          )}
                        </td>

                        {/* 3. 상품 */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-extrabold text-[#2A261F]">
                            {order.optionTitle}
                          </div>
                          <div className="text-xs font-bold text-[#556F59] mt-0.5">
                            수량: <strong>{order.quantity}박스</strong> (친환경 보틀 증정)
                          </div>
                        </td>

                        {/* 4. 금액 */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-black text-base text-[#2A4830]">
                            {order.totalPrice.toLocaleString()}원
                          </div>
                          <div className="text-xs text-[#797263] mt-0.5">
                            {order.paymentMethod}
                          </div>
                        </td>

                        {/* 5. 상태 */}
                        <td className="py-4 px-5 align-top">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                            order.status === '접수완료' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            order.status === '배송중' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            order.status === '배송완료' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === '배송중' && <Truck className="w-3.5 h-3.5" />}
                            {order.status === '배송완료' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {order.status === '접수완료' && <Clock className="w-3.5 h-3.5" />}
                            <span>{order.status}</span>
                          </span>
                        </td>

                        {/* 6. 상태 변경 버튼 (요청하신 "배송중", "배송완료" 버튼) */}
                        <td className="py-4 px-5 align-top text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* "배송중" 버튼 */}
                            <button
                              onClick={() => handleUpdateStatus(order.id!, '배송중')}
                              disabled={isUpdating || order.status === '배송중'}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                                order.status === '배송중'
                                  ? 'bg-blue-50 text-blue-400 border border-blue-200 cursor-not-allowed opacity-60'
                                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xs'
                              }`}
                              title="상태를 '배송중'으로 변경합니다"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>배송중</span>
                            </button>

                            {/* "배송완료" 버튼 */}
                            <button
                              onClick={() => handleUpdateStatus(order.id!, '배송완료')}
                              disabled={isUpdating || order.status === '배송완료'}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                                order.status === '배송완료'
                                  ? 'bg-emerald-50 text-emerald-400 border border-emerald-200 cursor-not-allowed opacity-60'
                                  : 'bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white shadow-xs'
                              }`}
                              title="상태를 '배송완료'로 변경합니다"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>배송완료</span>
                            </button>
                          </div>

                          {/* Quick return to 접수완료 if needed */}
                          {order.status !== '접수완료' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id!, '접수완료')}
                              disabled={isUpdating}
                              className="text-[11px] text-[#8C8474] hover:text-[#2A4830] underline mt-1.5 block mx-auto cursor-pointer"
                            >
                              접수완료로 되돌리기
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>

          {/* Bottom Table Footer Note */}
          <div className="p-4 bg-[#EDE6D7] border-t border-[#DFD7C7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6557] gap-2">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>실시간 동기화 작동 중: 외부 고객이 주문을 완료하는 즉시 목록에 자동 등록됩니다.</span>
            </div>
            <div>
              표시 중인 주문: <strong>{filteredOrders.length}건</strong> (총 {orders.length}건)
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
