export type ProductCategory = 'single' | 'pack_2' | 'pack_3' | 'pack_4';

export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  notes: string;
  features: string[];
  priceMad: number;
  compareAtPriceMad?: number;
  category: ProductCategory;
  bottleCount: number;
  volumeMl: number;
  imageUrl: string;
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface OrderInput {
  fullName: string;
  city: string;
  phone: string;
  product: Product;
}

export interface OrderRecord {
  id: string;
  fullName: string;
  city: string;
  phone: string;
  productId: string;
  productName: string;
  productCategory: ProductCategory;
  priceMad: number;
  paymentMethod: 'cod';
  status: OrderStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  single: 'عطر واحد',
  pack_2: 'باك عطرين',
  pack_3: 'باك 3 عطور',
  pack_4: 'باك 4 عطور',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'طلب جديد',
  confirmed: 'تم التأكيد',
  shipped: 'قيد التوصيل',
  delivered: 'تم التسليم',
  cancelled: 'ملغى',
};

export const MOROCCAN_CITIES: string[] = [
  'الدار البيضاء',
  'الرباط',
  'مراكش',
  'طنجة',
  'فاس',
  'أكادير',
  'مكناس',
  'وجدة',
  'القنيطرة',
  'تطوان',
  'سلا',
  'المحمدية',
  'تمارة',
  'بني ملال',
  'الجديدة',
  'آسفي',
  'الناظور',
  'خريبكة',
  'تازة',
  'العيون',
  'الداخلة',
  'ورزازات',
  'الصويرة',
];

export const ADMIN_ROOT_EMAIL = 'abdelghaforbahaddou@gmail.com';
