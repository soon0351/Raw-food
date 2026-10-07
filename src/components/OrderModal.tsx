import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  Loader2, 
  Copy, 
  Check, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { OrderData, OrderRecord } from '../types.ts';
import { createOrderInDb } from '../firebase.ts';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOption?: string;
  initialQty?: number;
  onOrderSuccess?: (order: OrderRecord) => void;
  defaultCustomerName?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialOption = 'box-1',
  initialQty = 1,
  onOrderSuccess,
  defaultCustomerName = ''
}) => {
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');
  const [option, setOption] = useState<string>(initialOption);
  const [quantity, setQuantity] = useState<number>(initialQty);

  const [formData, setFormData] = useState<OrderData>({
    customerName: defaultCustomerName,
    phone: '',
    address: '',
    detailAddress: '',
    requestNote: '부재 시 문 앞에 놓아주세요',
    paymentMethod: 'card',
    optionId: initialOption,
    quantity: initialQty
  });

  // Card payment mock inputs (Pre-filled requirement: 1111-2222-3333-4444)
  const [cardNumber, setCardNumber] = useState<string>('1111-2222-3333-4444');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('777');
  const [cardPwd, setCardPwd] = useState<string>('12');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<boolean>(false);
  const [copiedOrderNum, setCopiedOrderNum] = useState<boolean>(false);

  // Update customer name if logged in
  React.useEffect(() => {
    if (defaultCustomerName && !formData.customerName) {
      setFormData(prev => ({ ...prev, customerName: defaultCustomerName }));
    }
  }, [defaultCustomerName]);

  if (!isOpen) return null;

  const prices: Record<string, { label: string; price: number }> = {
    'box-1': { label: '1박스 (30포 / 1개월분)', price: 45000 },
    'box-2': { label: '2박스 (60포 / 2개월분)', price: 85000 },
    'box-3': { label: '3박스 (90포 / 3개월분)', price: 120000 },
  };

  const selectedPriceInfo = prices[option] || prices['box-1'];
  const totalPrice = selectedPriceInfo.price * quantity;

  // Step 1 -> Step 2 validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      alert('주문자 성함을 입력해주세요.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }
    if (!formData.address.trim()) {
      alert('배송지 주소를 입력해주세요.');
      return;
    }

    setStep('payment');
  };

  // Step 2: Practice Mock Payment execution
  const handleExecutePayment = async () => {
    setIsLoading(true);
    try {
      // Generate Order Number format: ORD-YYYYMMDD-XXXX (e.g. ORD-20261007-3843)
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const random4Digits = Math.floor(1000 + Math.random() * 9000);
      const generatedOrderNumber = `ORD-${dateStr}-${random4Digits}`;

      // Payment label
      const paymentLabels: Record<string, string> = {
        card: '신용/체크카드(연습용)',
        kakaopay: '카카오페이(연습용)',
        tosspay: '토스페이(연습용)',
        naverpay: '네이버페이(연습용)',
        bank: '무통장입금(연습용)'
      };

      const newOrderRecord: Omit<OrderRecord, 'id'> = {
        orderNumber: generatedOrderNumber,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        detailAddress: formData.detailAddress.trim(),
        requestNote: formData.requestNote,
        paymentMethod: paymentLabels[formData.paymentMethod] || formData.paymentMethod,
        optionId: option,
        optionTitle: selectedPriceInfo.label,
        quantity: quantity,
        unitPrice: selectedPriceInfo.price,
        totalPrice: totalPrice,
        status: '접수완료',
        createdAt: new Date().toISOString()
      };

      // Save permanently to Firebase Firestore
      const docId = await createOrderInDb(newOrderRecord);

      setOrderNumber(generatedOrderNumber);
      setStep('complete');

      if (onOrderSuccess) {
        onOrderSuccess({ id: docId, ...newOrderRecord });
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('농협 302-1234-5678-91');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderNum(true);
    setTimeout(() => setCopiedOrderNum(false), 2000);
  };

  const handleResetAndClose = () => {
    setStep('info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF7F0] w-full max-w-lg rounded-3xl border-2 border-[#DCD3C1] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#2A4830] text-white px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 'payment' && (
              <button
                onClick={() => setStep('info')}
                className="p-1 hover:bg-white/20 rounded-lg text-white mr-1 cursor-pointer"
                title="이전 단계"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-6 h-6 text-[#9EC49F]" />
            <h3 className="text-xl font-black">
              {step === 'info' && '하루한잔 생식 주문 정보'}
              {step === 'payment' && '간편 결제 (연습용 가짜 결제)'}
              {step === 'complete' && '주문 완료'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* STEP 1: Delivery Information Form */}
        {step === 'info' && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-5">
            
            {/* Selected Product Summary Box */}
            <div className="bg-[#EFE9DC] p-4 rounded-2xl border border-[#DFD8CA] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#353128]">선택 구성 :</span>
                <select
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                  className="bg-white px-3 py-1.5 rounded-lg border border-[#CEC3AF] text-sm font-extrabold text-[#2A4830]"
                >
                  <option value="box-1">1박스 (30포) — 45,000원</option>
                  <option value="box-2">2박스 (60포) — 85,000원</option>
                  <option value="box-3">3박스 (90포) — 120,000원</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[#655F53] font-medium">수량 :</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 bg-white rounded-md border border-[#D5CAA F] flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-extrabold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 bg-white rounded-md border border-[#D5CAA F] flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DFD5C2] flex justify-between items-center font-black">
                <span className="text-[#353128]">결제 예정 금액 :</span>
                <span className="text-xl text-[#2A4830]">{totalPrice.toLocaleString()}원 (무료배송)</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                  주문자 성함 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 스테판"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                  휴대폰 번호 *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                  배송지 주소 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="도로명 또는 지번 주소"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base mb-2"
                />
                <input
                  type="text"
                  placeholder="상세 주소 (동, 호수 등)"
                  value={formData.detailAddress}
                  onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-[#322F27] mb-1">
                  배송 요청사항
                </label>
                <select
                  value={formData.requestNote}
                  onChange={(e) => setFormData({ ...formData, requestNote: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:border-[#2A4830] text-base"
                >
                  <option value="부재 시 문 앞에 놓아주세요">부재 시 문 앞에 놓아주세요</option>
                  <option value="배송 전 미리 연락 부탁드립니다">배송 전 미리 연락 부탁드립니다</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                </select>
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 text-xl font-extrabold text-white bg-[#2A4830] hover:bg-[#1C3621] active:scale-98 rounded-2xl shadow-lg shadow-[#2A4830]/20 transition-all cursor-pointer"
              >
                다음: 결제하기 화면으로 이동
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: Practice Mock Payment Screen */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 space-y-5 animate-fadeIn">
            
            {/* BIG REQUIRED NOTICE BANNER: 실제로 결제되지 않는 연습용입니다 */}
            <div className="bg-amber-100 border-2 border-amber-400 text-amber-950 p-4 rounded-2xl text-center shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-amber-900 flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
                <span>실제로 결제되지 않는 연습용입니다</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                실제 카드 승인이나 계좌 출금이 발생하지 않는 모의 결제 화면입니다. 안심하고 테스트하세요.
              </p>
            </div>

            {/* Payment Method Selector (Card, Naver, Toss, Kakao, Bank) */}
            <div className="space-y-2">
              <label className="block text-sm font-extrabold text-[#322F27]">
                결제 수단 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'card', label: '신용/체크카드', icon: '💳' },
                  { id: 'kakaopay', label: '카카오페이', icon: '🟡' },
                  { id: 'tosspay', label: '토스페이', icon: '🔵' },
                  { id: 'naverpay', label: '네이버페이', icon: '🟢' },
                  { id: 'bank', label: '무통장입금', icon: '🏦' }
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: pay.id as any })}
                    className={`py-3 px-2 rounded-xl border text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      formData.paymentMethod === pay.id
                        ? 'border-[#2A4830] bg-[#E8EFE5] text-[#1E3723] shadow-xs ring-2 ring-[#2A4830]/30'
                        : 'border-[#D5CBB9] bg-white text-[#575246] hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <span>{pay.icon}</span>
                    <span>{pay.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail input block depending on payment method */}
            {formData.paymentMethod === 'card' && (
              /* Credit Card Mock Input - PRE-FILLED WITH 1111-2222-3333-4444 */
              <div className="bg-white p-5 rounded-2xl border border-[#D5CBB9] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#6F695D]">
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-[#2A4830]" />
                    카드 결제 정보 (연습용 번호 자동 입력됨)
                  </span>
                  <span className="text-[#2A4830] bg-[#E8EFE5] px-2 py-0.5 rounded">가짜 결제</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B3830] mb-1">
                    카드번호 *
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] rounded-xl border border-[#D5CBB9] font-mono font-bold text-base text-[#1E3723]"
                    placeholder="1111-2222-3333-4444"
                  />
                  <span className="text-[11px] text-[#787163] mt-0.5 block">
                    ※ 연습용 번호 <strong className="text-[#2A4830]">1111-2222-3333-4444</strong>가 기본 입력되어 있습니다.
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#3B3830] mb-1">
                      유효기간 (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F3] rounded-lg border border-[#D5CBB9] text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B3830] mb-1">
                      CVC (3자리)
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F3] rounded-lg border border-[#D5CBB9] text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B3830] mb-1">
                      비밀번호 앞 2자리
                    </label>
                    <input
                      type="password"
                      value={cardPwd}
                      onChange={(e) => setCardPwd(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F3] rounded-lg border border-[#D5CBB9] text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'kakaopay' && (
              <div className="bg-[#FEE500]/20 border border-[#FEE500] p-4 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🟡</span>
                <div className="text-xs">
                  <strong className="block text-sm font-black text-[#3C1E1E]">카카오페이 모의 결제</strong>
                  카카오페이 머니 / 간편카드 모의 승인이 진행됩니다. (실제 요금 청구 없음)
                </div>
              </div>
            )}

            {formData.paymentMethod === 'tosspay' && (
              <div className="bg-[#0064FF]/10 border border-[#0064FF]/30 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🔵</span>
                <div className="text-xs">
                  <strong className="block text-sm font-black text-[#0064FF]">토스페이 모의 결제</strong>
                  토스 원클릭 모의 간편결제가 진행됩니다. (실제 요금 청구 없음)
                </div>
              </div>
            )}

            {formData.paymentMethod === 'naverpay' && (
              <div className="bg-[#03C75A]/10 border border-[#03C75A]/30 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🟢</span>
                <div className="text-xs">
                  <strong className="block text-sm font-black text-[#03C75A]">네이버페이 모의 결제</strong>
                  네이버페이 포인트 / 간편카드 모의 승인이 진행됩니다. (실제 요금 청구 없음)
                </div>
              </div>
            )}

            {formData.paymentMethod === 'bank' && (
              <div className="bg-[#F3EFE6] border border-[#DFD5C2] p-4 rounded-2xl space-y-1 text-xs">
                <strong className="block text-sm font-black text-[#2A4830]">무통장입금 (모의 가상계좌)</strong>
                <div>농협 302-1234-5678-91 (예금주: 하루한잔자연생식)</div>
                <div className="text-[#787163]">※ 연습용이므로 실제로 입금하지 않으셔도 주문이 정상 접수됩니다.</div>
              </div>
            )}

            {/* Price Summary Before Execution */}
            <div className="bg-[#EFE9DC] p-4 rounded-2xl border border-[#DFD8CA] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#6A6458] block">최종 결제 금액</span>
                <span className="text-sm font-bold text-[#2A4830]">
                  {selectedPriceInfo.label} × {quantity}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#2A4830]">
                {totalPrice.toLocaleString()}원
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isLoading}
                className="w-full py-4 sm:py-5 text-xl font-black text-white bg-[#2A4830] hover:bg-[#1C3621] active:scale-98 rounded-2xl shadow-xl shadow-[#2A4830]/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>연습용 결제 승인 중...</span>
                  </>
                ) : (
                  <span>{totalPrice.toLocaleString()}원 결제하기 (연습용)</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('info')}
                className="w-full py-2.5 text-sm font-bold text-[#6D675B] hover:text-[#2A4830] transition-colors cursor-pointer"
              >
                ← 이전 단계 (배송지 정보 수정)
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Order Completed View */}
        {step === 'complete' && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-fadeIn">
            
            <div className="w-20 h-20 bg-[#E8EFE5] text-[#2A4830] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-bold text-[#3D6645] bg-[#E8EFE5] px-3.5 py-1 rounded-full">
                연습용 결제 승인 완료
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-[#1F3723]">
                주문이 정상 완료되었습니다!
              </h4>
              <p className="text-xs sm:text-sm text-[#5B5549]">
                실제 결제는 발생하지 않았으며, 사장님 관리 대시보드에 정상 접수되었습니다.
              </p>
            </div>

            {/* Receipt Summary with ORD- formatted order number */}
            <div className="bg-white rounded-2xl p-5 border border-[#DFD7C7] text-left space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-[#EFEAE0]">
                <span className="text-[#756F62]">주문번호</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-base text-[#2A4830]">{orderNumber}</span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-1 hover:bg-[#EFEAE0] rounded text-xs text-[#2A4830] cursor-pointer"
                    title="주문번호 복사"
                  >
                    {copiedOrderNum ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-[#756F62]">주문자 성함</span>
                <span className="font-bold text-[#2C2821]">{formData.customerName} 님</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#756F62]">연락처</span>
                <span className="font-bold text-[#2C2821]">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#756F62]">배송지</span>
                <span className="font-bold text-[#2C2821] text-right max-w-[240px]">
                  {formData.address} {formData.detailAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#756F62]">선택 상품</span>
                <span className="font-bold text-[#2C2821]">
                  {selectedPriceInfo.label} × {quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#756F62]">결제 수단</span>
                <span className="font-bold text-[#2A4830]">
                  {formData.paymentMethod === 'card' ? '신용카드 (1111-****-****-4444)' :
                   formData.paymentMethod === 'kakaopay' ? '카카오페이 (모의)' :
                   formData.paymentMethod === 'tosspay' ? '토스페이 (모의)' :
                   formData.paymentMethod === 'naverpay' ? '네이버페이 (모의)' : '무통장입금 (모의)'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EFEAE0] text-base font-extrabold text-[#2A4830]">
                <span>결제 금액</span>
                <span>{totalPrice.toLocaleString()}원 (무료배송)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#736D61] bg-[#EFE9DD] py-3 px-4 rounded-xl">
              <Truck className="w-4 h-4 text-[#3D6645]" />
              <span>우체국 택배로 안전하게 발송되며, 상단 '주문 조회'에서 확인하실 수 있습니다.</span>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-4 text-lg font-black text-white bg-[#2A4830] hover:bg-[#1C3621] rounded-2xl transition-all cursor-pointer"
            >
              확인 (닫기)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
