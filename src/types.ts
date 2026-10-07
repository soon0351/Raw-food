export interface ProductOption {
  id: string;
  name: string;
  badge?: string;
  packs: number;
  originalPrice: number;
  price: number;
  bonus?: string;
}

export interface OrderData {
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  requestNote: string;
  paymentMethod: 'kakaopay' | 'card' | 'bank' | 'naverpay' | 'tosspay';
  optionId: string;
  quantity: number;
}

export interface OrderRecord {
  id?: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  requestNote: string;
  paymentMethod: string;
  optionId: string;
  optionTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: '접수완료' | '입금확인' | '배송준비' | '배송중' | '배송완료' | '주문취소';
  createdAt: string;
  trackingNumber?: string;
}

export interface IngredientCategory {
  title: string;
  count: number;
  icon: string;
  description: string;
  items: string[];
}
