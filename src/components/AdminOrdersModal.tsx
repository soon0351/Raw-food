import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  Calendar,
  AlertCircle
} from 'lucide-react';
import { OrderRecord } from '../types.ts';
import { subscribeToOrders, updateOrderStatusInDb, createOrderInDb } from '../firebase.ts';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [trackingInput, setTrackingInput] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter((o) => o.status === '접수완료').length;
  const preparingCount = orders.filter((o) => o.status === '배송준비').length;
  const shippingCount = orders.filter((o) => o.status === '배송중').length;

  // Status update
  const handleStatusChange = async (orderId: string, newStatus: OrderRecord['status'], trackingNum?: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusInDb(orderId, newStatus, trackingNum);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, trackingNumber: trackingNum || selectedOrder.trackingNumber });
      }
    } catch (err) {
      console.error('Status update failed:', err);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Seed sample order (e.g., from screenshot)
  const handleAddSampleOrder = async () => {
    try {
      setLoading(true);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      await createOrderInDb({
        orderNumber: `SG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomNum}`,
        customerName: '권순택',
        phone: '01054025823',
        address: '대전 법동 동춘당로 151',
        detailAddress: '102-904',
        requestNote: '부재 시 문 앞에 놓아주세요',
        paymentMethod: 'kakaopay',
        optionId: 'box-1',
        optionTitle: '1박스 (30포 / 1개월분)',
        quantity: 1,
        unitPrice: 45000,
        totalPrice: 45000,
        status: '접수완료',
        createdAt: new Date().toISOString()
      });
      alert('권순택 고객님의 테스트 주문이 정상 등록되었습니다.');
    } catch (err) {
      console.error(err);
      alert('주문 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // CSV Export for Excel
  const handleExportCsv = () => {
    if (orders.length === 0) {
      alert('다운로드할 주문 내역이 없습니다.');
      return;
    }

    const headers = ['주문번호', '접수일시', '주문자명', '연락처', '배송지주소', '상세주소', '배송요청사항', '선택상품', '수량', '결제금액', '결제방법', '주문상태', '송장번호'];
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
      `"${o.status}"`,
      `"${o.trackingNumber || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `하루한잔생식_주문목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF7F0] w-full max-w-5xl rounded-3xl border-2 border-[#DCD3C1] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh] animate-fadeIn">
        
        {/* Top Header */}
        <div className="bg-[#1E3723] text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#3D6645] flex items-center justify-center text-lg font-black">
              生
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                사장님 주문 관리 센터 (실시간 DB 연동)
              </h3>
              <p className="text-xs text-[#A8C7AA]">
                외부 고객이 주문한 모든 내역이 실시간으로 여기에 자동 저장 및 집계됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-[#EDE6D7] px-6 py-4 border-b border-[#D8CEBD] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
          <div className="bg-white p-3 rounded-xl border border-[#D5CAA F]">
            <span className="text-xs text-[#706B5F] font-bold block">총 누적 주문</span>
            <span className="text-xl font-black text-[#1E3723]">{orders.length}건</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#D5CAA F]">
            <span className="text-xs text-[#706B5F] font-bold block">총 결제 금액</span>
            <span className="text-xl font-black text-[#2A4830]">{totalSales.toLocaleString()}원</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#D5CAA F]">
            <span className="text-xs text-[#C2410C] font-bold block">신규 접수 대기</span>
            <span className="text-xl font-black text-[#C2410C]">{pendingCount}건</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#D5CAA F]">
            <span className="text-xs text-[#2563EB] font-bold block">배송 진행 중</span>
            <span className="text-xl font-black text-[#2563EB]">{preparingCount + shippingCount}건</span>
          </div>
        </div>

        {/* Controls Bar: Search, Filters, CSV Export */}
        <div className="p-4 sm:p-6 bg-[#FAF7F0] border-b border-[#E3DCCE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#8C8475] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="고객명, 연락처, 주문번호 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#D5CBB9] text-sm focus:outline-none focus:border-[#2A4830]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white px-3 py-2 rounded-xl border border-[#D5CBB9] text-sm font-bold text-[#3D3A33]"
            >
              <option value="all">전체 상태 보기</option>
              <option value="접수완료">접수완료 ({orders.filter(o => o.status === '접수완료').length})</option>
              <option value="입금확인">입금확인</option>
              <option value="배송준비">배송준비</option>
              <option value="배송중">배송중</option>
              <option value="배송완료">배송완료</option>
              <option value="주문취소">주문취소</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {orders.length === 0 && (
              <button
                onClick={handleAddSampleOrder}
                className="px-3 py-2 bg-[#E9EFE6] text-[#2A4830] hover:bg-[#D5E4D0] border border-[#BACFB4] rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                + 샘플 주문 등록 (권순택)
              </button>
            )}
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-[#2A4830] text-white hover:bg-[#1E3723] rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>택배 송장용 CSV</span>
            </button>
          </div>
        </div>

        {/* Orders Table & Detail View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-20 text-center text-[#706B5F]">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#2A4830] mb-2" />
              <p className="font-bold">주문 데이터를 실시간 동기화 중입니다...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-[#E3DCCE] p-8">
              <ShoppingBag className="w-12 h-12 text-[#BDB5A4] mx-auto" />
              <h4 className="text-xl font-bold text-[#3C3831]">접수된 주문이 없습니다.</h4>
              <p className="text-sm text-[#736E63] max-w-md mx-auto">
                고객이 메인 페이지에서 "주문하기"를 완료하면 즉시 이곳에 실시간으로 표시됩니다.
              </p>
              <button
                onClick={handleAddSampleOrder}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2A4830] text-white font-bold rounded-xl text-sm hover:bg-[#1C3621]"
              >
                권순택 고객님 예시 주문 바로 추가해보기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id || order.orderNumber}
                    className={`bg-white rounded-2xl border-2 transition-all p-5 shadow-xs ${
                      isSelected ? 'border-[#2A4830] bg-[#FAF8F2]' : 'border-[#E3DCCE] hover:border-[#CEC3AE]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EAE0] gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#635D52] bg-[#EFE9DC] px-2.5 py-1 rounded-md">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-[#807A6E]">
                          {new Date(order.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#6B6559]">처리 상태:</span>
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id!, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border cursor-pointer ${
                            order.status === '접수완료' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            order.status === '입금확인' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            order.status === '배송준비' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            order.status === '배송중' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            order.status === '배송완료' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="접수완료">접수완료</option>
                          <option value="입금확인">입금확인</option>
                          <option value="배송준비">배송준비</option>
                          <option value="배송중">배송중</option>
                          <option value="배송완료">배송완료</option>
                          <option value="주문취소">주문취소</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 items-center">
                      {/* Customer Info */}
                      <div className="md:col-span-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-[#211E18]">{order.customerName}</span>
                          <span className="text-xs bg-[#E8EFE5] text-[#2A4830] font-bold px-2 py-0.5 rounded">
                            {order.paymentMethod === 'bank' ? '무통장입금' : order.paymentMethod === 'kakaopay' ? '카카오페이' : order.paymentMethod === 'naverpay' ? '네이버페이' : '카드결제'}
                          </span>
                        </div>
                        <a 
                          href={`tel:${order.phone}`} 
                          className="text-sm font-bold text-[#2A4830] flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.phone}</span>
                        </a>
                      </div>

                      {/* Shipping Address */}
                      <div className="md:col-span-5 space-y-1">
                        <div className="flex items-start gap-1.5 text-sm text-[#3E3A33]">
                          <MapPin className="w-4 h-4 text-[#8C8475] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">{order.address} {order.detailAddress}</div>
                            {order.requestNote && (
                              <div className="text-xs text-[#7A7467] mt-0.5">요청: {order.requestNote}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items & Total Price */}
                      <div className="md:col-span-3 text-left md:text-right space-y-1">
                        <div className="text-sm font-bold text-[#454137]">
                          {order.optionTitle} × {order.quantity}
                        </div>
                        <div className="text-lg font-black text-[#2A4830]">
                          {order.totalPrice.toLocaleString()}원
                        </div>
                      </div>
                    </div>

                    {/* Tracking Number Input for Courier */}
                    {order.status === '배송중' && (
                      <div className="mt-3 pt-3 border-t border-[#F0EAE0] flex items-center gap-2 text-xs">
                        <Truck className="w-4 h-4 text-[#2A4830]" />
                        <span className="font-bold text-[#554F45]">우체국 송장번호:</span>
                        <input
                          type="text"
                          placeholder="송장번호 입력"
                          defaultValue={order.trackingNumber || ''}
                          onBlur={(e) => handleStatusChange(order.id!, order.status, e.target.value)}
                          className="px-2.5 py-1 bg-[#F9F7F2] rounded border border-[#D5CBB9] text-xs font-mono w-48"
                        />
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EDE6D7] border-t border-[#DCD3C1] flex items-center justify-between text-xs text-[#6F695C] shrink-0">
          <div>
            💡 실제 Firestore 데이터베이스(`orders` 컬렉션)와 실시간 연동되어 있습니다.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2A4830] text-white font-bold rounded-xl hover:bg-[#1E3723] cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
