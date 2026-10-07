import React, { useState } from 'react';
import { X, Search, Package, Clock, Truck, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { OrderRecord } from '../types.ts';
import { lookupOrdersByPhone } from '../firebase.ts';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [results, setResults] = useState<OrderRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      alert('주문 시 입력하신 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const orders = await lookupOrdersByPhone(phoneNumber.trim());
      setResults(orders);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      alert('주문 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF7F0] w-full max-w-lg rounded-3xl border-2 border-[#DCD3C1] shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#2A4830] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#9EC49F]" />
            <h3 className="text-xl font-black">내 주문 내역 조회</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Phone Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-sm font-extrabold text-[#332F27]">
              주문자 휴대폰 번호
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="010-1234-5678 또는 01012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#2A4830] hover:bg-[#1E3723] text-white font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>조회</span>
              </button>
            </div>
            <p className="text-xs text-[#706B5F]">
              주문 접수 시 등록한 연락처로 실시간 주문 상태를 조회하실 수 있습니다.
            </p>
          </form>

          {/* Results Display */}
          {loading && (
            <div className="py-12 text-center text-[#706B5F]">
              <Clock className="w-8 h-8 animate-spin mx-auto text-[#2A4830] mb-2" />
              <p className="font-bold">주문 내역을 검색 중입니다...</p>
            </div>
          )}

          {!loading && hasSearched && results && (
            <div className="space-y-4 pt-2">
              <div className="text-sm font-bold text-[#454137]">
                조회 결과: 총 {results.length}건
              </div>

              {results.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-[#DCD3C1] text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-[#A8A090] mx-auto" />
                  <p className="font-bold text-[#353129]">해당 번호로 접수된 주문이 없습니다.</p>
                  <p className="text-xs text-[#736E62]">번호를 다시 확인하시거나 고객센터(1588-5050)로 문의해주세요.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {results.map((order) => (
                    <div
                      key={order.id || order.orderNumber}
                      className="bg-white p-5 rounded-2xl border border-[#DCD3C1] space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
                        <span className="font-mono text-xs font-bold text-[#2A4830]">
                          {order.orderNumber}
                        </span>
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                          order.status === '접수완료' ? 'bg-orange-100 text-orange-800' :
                          order.status === '입금확인' ? 'bg-blue-100 text-blue-800' :
                          order.status === '배송준비' ? 'bg-amber-100 text-amber-800' :
                          order.status === '배송중' ? 'bg-purple-100 text-purple-800' :
                          order.status === '배송완료' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="text-sm space-y-1 text-[#423E34]">
                        <div className="font-extrabold text-base text-[#1E3723]">{order.optionTitle} × {order.quantity}박스</div>
                        <div>주문자: <strong>{order.customerName}</strong> 님</div>
                        <div>배송지: {order.address} {order.detailAddress}</div>
                        <div className="text-xs text-[#736E62]">주문일시: {new Date(order.createdAt).toLocaleString('ko-KR')}</div>
                        {order.trackingNumber && (
                          <div className="bg-[#E8EFE5] p-2 rounded-lg text-xs font-bold text-[#2A4830] flex items-center gap-1.5 mt-2">
                            <Truck className="w-4 h-4" />
                            <span>우체국 택배 송장번호: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#F0EAE0] flex justify-between items-center text-sm font-black text-[#2A4830]">
                        <span>결제 금액</span>
                        <span>{order.totalPrice.toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EDE6D7] border-t border-[#DCD3C1] text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2A4830] text-white font-bold rounded-xl hover:bg-[#1E3723] cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
