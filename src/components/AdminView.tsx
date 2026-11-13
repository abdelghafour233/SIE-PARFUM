import { useEffect, useState, type FormEvent } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { Download, LogOut, Plus, Trash2, Edit3, PackageCheck } from 'lucide-react';
import { STUDIO_IMAGE_PRESETS } from '../data/catalogDefaults';
import { auth, googleProvider } from '../lib/firebase';
import {
  deleteOrder,
  deleteProduct,
  saveProduct,
  seedInitialProductsToFirestore,
  subscribeAllProductsAdmin,
  subscribeOrdersAdmin,
  updateOrderStatus,
} from '../services/storeService';
import {
  ADMIN_ROOT_EMAIL,
  CATEGORY_LABELS,
  ORDER_STATUS_LABELS,
  type OrderRecord,
  type OrderStatus,
  type Product,
  type ProductCategory,
} from '../types/store';
import { LuxuryImage } from './LuxuryImage';

interface ProductFormState {
  name: string;
  subtitle: string;
  description: string;
  notes: string;
  featuresText: string;
  priceMad: string;
  compareAtPriceMad: string;
  category: ProductCategory;
  bottleCount: string;
  volumeMl: string;
  imageUrl: string;
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: string;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  subtitle: 'عطر واحد · 100 مل · تركيز فاخر',
  description: '',
  notes: '',
  featuresText: 'تركيز عالٍ وثبات طويل\nتوصيل لجميع مدن المغرب\nالدفع عند الاستلام',
  priceMad: '299',
  compareAtPriceMad: '',
  category: 'single',
  bottleCount: '1',
  volumeMl: '100',
  imageUrl: STUDIO_IMAGE_PRESETS[0].url,
  isBestSeller: false,
  isActive: true,
  sortOrder: '10',
};

export function AdminView() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<ProductFormState>(EMPTY_FORM);
  const [savingProduct, setSavingProduct] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const isAuthorizedAdmin =
    Boolean(user) &&
    user?.emailVerified === true &&
    user?.email?.toLowerCase() === ADMIN_ROOT_EMAIL.toLowerCase();

  useEffect(() => {
    if (!authReady || !isAuthorizedAdmin) {
      return;
    }
    setDataError(null);

    const unsubOrders = subscribeOrdersAdmin(
      (list) => setOrders(list),
      (err) => setDataError(err.message),
    );
    const unsubProducts = subscribeAllProductsAdmin(
      (list) => setProducts(list),
      (err) => setDataError(err.message),
    );

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, [authReady, isAuthorizedAdmin]);

  const handleGoogleSignIn = async () => {
    setDataError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setDataError(
        err instanceof Error ? err.message : 'تعذر تسجيل الدخول عبر Google.',
      );
    }
  };

  const handleExportOrdersCsv = () => {
    const headers = [
      'رقم الطلب',
      'الاسم الكامل',
      'المدينة',
      'رقم الهاتف',
      'المنتج أو العرض',
      'الثمن (MAD)',
      'طريقة الدفع',
      'الحالة',
      'التاريخ',
    ];
    const rows = orders.map((o) => [
      o.id,
      o.fullName,
      o.city,
      o.phone,
      o.productName,
      String(o.priceMad),
      'الدفع عند الاستلام',
      ORDER_STATUS_LABELS[o.status],
      o.createdAt ? o.createdAt.toLocaleString('ar-MA') : '',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dar-al-anbar-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openNewProductForm = () => {
    setEditingProduct(null);
    setFormState({
      ...EMPTY_FORM,
      sortOrder: String(products.length + 1),
    });
    setIsFormOpen(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      subtitle: product.subtitle,
      description: product.description,
      notes: product.notes,
      featuresText: product.features.join('\n'),
      priceMad: String(product.priceMad),
      compareAtPriceMad: product.compareAtPriceMad ? String(product.compareAtPriceMad) : '',
      category: product.category,
      bottleCount: String(product.bottleCount),
      volumeMl: String(product.volumeMl),
      imageUrl: product.imageUrl,
      isBestSeller: product.isBestSeller,
      isActive: product.isActive,
      sortOrder: String(product.sortOrder),
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setDataError(null);
    try {
      const features = formState.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      await saveProduct(
        {
          name: formState.name,
          subtitle: formState.subtitle,
          description: formState.description,
          notes: formState.notes,
          features,
          priceMad: Number(formState.priceMad),
          compareAtPriceMad: formState.compareAtPriceMad
            ? Number(formState.compareAtPriceMad)
            : undefined,
          category: formState.category,
          bottleCount: Number(formState.bottleCount),
          volumeMl: Number(formState.volumeMl),
          imageUrl: formState.imageUrl,
          isBestSeller: formState.isBestSeller,
          isActive: formState.isActive,
          sortOrder: Number(formState.sortOrder || 0),
        },
        editingProduct?.id,
        editingProduct?.createdAt,
      );
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'تعذر حفظ المنتج.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSeedCatalog = async () => {
    setSeeding(true);
    setDataError(null);
    try {
      await seedInitialProductsToFirestore();
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'تعذر نشر الكتالوج.');
    } finally {
      setSeeding(false);
    }
  };

  if (!authReady) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-[#111113]/65">
        جاري التحقق من جلسة الإدارة...
      </section>
    );
  }

  if (!user) {
    return (
      <section className="max-w-lg mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white border border-[#111113]/10 p-8 sm:p-10 text-center">
          <p className="text-xs font-medium text-[#8E6D23] mb-2">حماية بيانات الزبائن</p>
          <h1 className="font-display text-3xl font-bold text-[#111113] mb-3">
            لوحة إدارة المتجر والطلبات
          </h1>
          <p className="text-sm text-[#111113]/70 leading-relaxed mb-8">
            للاطلاع على طلبات الزبائن وتعديل العطور والأسعار والصور، يرجى تسجيل الدخول بحساب مالك المتجر المعتمد.
          </p>

          {dataError && (
            <p role="alert" className="mb-4 text-xs text-red-700 bg-red-50 p-3 border border-red-200">
              {dataError}
            </p>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full min-h-[48px] px-6 py-3 bg-[#111113] text-[#FAF9F6] text-sm font-semibold hover:bg-[#B8923A] hover:text-[#0B0B0D] transition-colors rounded-sm cursor-pointer"
          >
            تسجيل الدخول بحساب Google الإداري
          </button>
        </div>
      </section>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <section className="max-w-lg mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white border border-[#111113]/10 p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-[#111113] mb-3">
            حساب غير مخول للإدارة
          </h1>
          <p className="text-sm text-[#111113]/70 mb-6">
            الحساب المسجل ({user.email}) لا يملك صلاحية إدارة الطلبات لحماية خصوصية بيانات الزبائن.
          </p>
          <button
            type="button"
            onClick={() => void signOut(auth)}
            className="px-6 py-2.5 border border-[#111113]/20 text-sm font-medium text-[#111113] hover:bg-[#111113]/5 rounded-sm cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </section>
    );
  }

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const totalRevenueMad = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.priceMad, 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#111113]/10">
        <div>
          <p className="text-xs font-medium text-[#8E6D23] mb-1">
            لوحة التحكم الخاصة بالمتجر
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111113]">
            إدارة الطلبات والمنتجات
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#111113]/65 hidden sm:inline">{user.email}</span>
          <button
            type="button"
            onClick={() => void signOut(auth)}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 border border-[#111113]/20 text-xs font-medium text-[#111113] hover:bg-[#111113]/5 rounded-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Real-time Store Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#111113]/10 p-5">
          <p className="text-xs text-[#111113]/60 mb-1">إجمالي الطلبات المستلمة</p>
          <p className="text-2xl font-bold text-[#111113] tabular-nums">{orders.length}</p>
        </div>
        <div className="bg-white border border-[#111113]/10 p-5">
          <p className="text-xs text-[#111113]/60 mb-1">طلبات جديدة بانتظار التأكيد</p>
          <p className="text-2xl font-bold text-[#8E6D23] tabular-nums">{newOrdersCount}</p>
        </div>
        <div className="bg-white border border-[#111113]/10 p-5">
          <p className="text-xs text-[#111113]/60 mb-1">القيمة الإجمالية للطلبات</p>
          <p className="text-2xl font-bold text-[#111113] tabular-nums">
            {totalRevenueMad} درهم
          </p>
        </div>
        <div className="bg-white border border-[#111113]/10 p-5">
          <p className="text-xs text-[#111113]/60 mb-1">العطور المنشورة في قاعدة البيانات</p>
          <p className="text-2xl font-bold text-[#111113] tabular-nums">{products.length}</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 bg-[#F2EFE9] p-1 rounded-sm">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#111113] text-[#FAF9F6]'
                : 'text-[#111113]/75 hover:text-[#111113]'
            }`}
          >
            الطلبات الواردة ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#111113] text-[#FAF9F6]'
                : 'text-[#111113]/75 hover:text-[#111113]'
            }`}
          >
            إدارة العطور والأسعار ({products.length})
          </button>
        </div>

        {activeTab === 'orders' && orders.length > 0 && (
          <button
            type="button"
            onClick={handleExportOrdersCsv}
            className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 border border-[#111113]/20 bg-white text-sm font-medium text-[#111113] hover:border-[#B8923A] rounded-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV (Google Sheets / Excel)</span>
          </button>
        )}

        {activeTab === 'products' && (
          <div className="flex flex-wrap items-center gap-3">
            {products.length === 0 && (
              <button
                type="button"
                onClick={handleSeedCatalog}
                disabled={seeding}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 border border-[#B8923A] bg-[#FAF9F6] text-sm font-semibold text-[#111113] hover:bg-[#B8923A]/15 rounded-sm cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-[#B8923A]" />
                <span>{seeding ? 'جاري النشر...' : 'نشر الكتالوج الأساسي في قاعدة البيانات'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={openNewProductForm}
              className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 bg-[#111113] text-[#FAF9F6] text-sm font-semibold hover:bg-[#B8923A] hover:text-[#0B0B0D] rounded-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عطر أو عرض جديد</span>
            </button>
          </div>
        )}
      </div>

      {dataError && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-sm"
        >
          {dataError}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#111113]/10 overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#111113]/65">
              لا توجد طلبات مسجلة بعد. عند قيام أي زبون بتأكيد طلب عبر نموذج «تأكيد الطلب»، سيظهر طلبه هنا فوراً.
            </div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-[#111113]/10 bg-[#FAF9F6] text-xs font-semibold text-[#111113]/70">
                  <th className="py-3.5 px-4">الزبون</th>
                  <th className="py-3.5 px-4">المدينة</th>
                  <th className="py-3.5 px-4">الهاتف</th>
                  <th className="py-3.5 px-4">المنتج أو العرض</th>
                  <th className="py-3.5 px-4">الثمن</th>
                  <th className="py-3.5 px-4">التاريخ</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111113]/8 text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-4 font-semibold text-[#111113]">
                      {order.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-[#111113]/80">{order.city}</td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <a
                        href={`tel:${order.phone}`}
                        dir="ltr"
                        className="text-[#8E6D23] font-medium hover:underline inline-block"
                      >
                        {order.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-[#111113]">{order.productName}</td>
                    <td className="py-3.5 px-4 font-bold tabular-nums">
                      {order.priceMad} درهم
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#111113]/60 tabular-nums">
                      {order.createdAt ? order.createdAt.toLocaleDateString('ar-MA') : 'الآن'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        aria-label={`حالة طلب ${order.fullName}`}
                        value={order.status}
                        onChange={(e) =>
                          void updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="min-h-[36px] px-2.5 py-1 bg-[#FAF9F6] border border-[#111113]/20 text-xs font-medium rounded-sm"
                      >
                        {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((st) => (
                          <option key={st} value={st}>
                            {ORDER_STATUS_LABELS[st]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => void deleteOrder(order.id)}
                        aria-label={`حذف طلب ${order.fullName}`}
                        className="p-2 text-[#111113]/50 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Products Management Tab */}
      {activeTab === 'products' && (
        <div>
          {isFormOpen && (
            <form
              onSubmit={handleSaveProduct}
              className="bg-white border border-[#B8923A]/50 p-6 sm:p-8 mb-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#111113]/10 pb-4">
                <h2 className="font-display text-2xl font-bold text-[#111113]">
                  {editingProduct ? `تعديل: ${editingProduct.name}` : 'إضافة عطر أو عرض جديد'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-sm text-[#111113]/60 hover:text-[#111113] cursor-pointer"
                >
                  إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">اسم العطر أو الباقة</label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="مثال: عود الملكي"
                    className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">نوع العرض</label>
                  <select
                    value={formState.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const bottles =
                        cat === 'single' ? '1' : cat === 'pack_2' ? '2' : cat === 'pack_3' ? '3' : '4';
                      setFormState({ ...formState, category: cat, bottleCount: bottles });
                    }}
                    className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm"
                  >
                    {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    الثمن بالدرهم المغربي (MAD)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50000}
                    value={formState.priceMad}
                    onChange={(e) => setFormState({ ...formState, priceMad: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    السعر قبل التخفيض (اختياري)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={formState.compareAtPriceMad}
                    onChange={(e) =>
                      setFormState({ ...formState, compareAtPriceMad: e.target.value })
                    }
                    className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">العنوان الفرعي المختصر</label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={formState.subtitle}
                    onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">الحجم (مل)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={500}
                    value={formState.volumeMl}
                    onChange={(e) => setFormState({ ...formState, volumeMl: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">المكونات العطرية</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="مثال: العود الكمبودي، العنبر، الزعفران"
                  className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">وصف المنتج</label>
                <textarea
                  rows={3}
                  required
                  maxLength={1500}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  المميزات (ميزة واحدة في كل سطر)
                </label>
                <textarea
                  rows={3}
                  required
                  value={formState.featuresText}
                  onChange={(e) => setFormState({ ...formState, featuresText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  رابط الصورة (أو اختر من صور الاستوديو الجاهزة)
                </label>
                <input
                  type="text"
                  required
                  maxLength={1000}
                  dir="ltr"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  className="w-full min-h-[42px] px-3 py-2 bg-[#FAF9F6] border border-[#111113]/20 text-sm rounded-sm mb-2.5 text-left"
                />
                <div className="flex flex-wrap gap-2">
                  {STUDIO_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormState({ ...formState, imageUrl: preset.url })}
                      className={`px-3 py-1.5 text-xs border rounded-sm cursor-pointer ${
                        formState.imageUrl === preset.url
                          ? 'border-[#B8923A] bg-[#111113] text-[#FAF9F6]'
                          : 'border-[#111113]/20 bg-[#FAF9F6] text-[#111113]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isBestSeller}
                    onChange={(e) =>
                      setFormState({ ...formState, isBestSeller: e.target.checked })
                    }
                  />
                  <span>تمييز كـ «الأكثر مبيعاً»</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                  />
                  <span>عرض المنتج للزبائن في المتجر</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="min-h-[46px] px-7 py-2.5 bg-[#111113] text-[#FAF9F6] text-sm font-bold hover:bg-[#B8923A] hover:text-[#0B0B0D] rounded-sm cursor-pointer"
                >
                  {savingProduct ? 'جاري الحفظ...' : 'حفظ المنتج في قاعدة البيانات'}
                </button>
              </div>
            </form>
          )}

          {products.length === 0 ? (
            <div className="bg-white border border-[#111113]/10 p-12 text-center text-sm text-[#111113]/70">
              قاعدة البيانات لا تحتوي على منتجات مخصصة بعد. يمكنك الضغط على «نشر الكتالوج الأساسي في قاعدة البيانات» أعلاه أو إضافة منتج جديد.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#111113]/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-[#F2EFE9] overflow-hidden">
                      <LuxuryImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-[#111113]/60 mb-1">
                        {CATEGORY_LABELS[product.category]} ·{' '}
                        {product.isActive ? 'منشور' : 'مخفي'}
                      </p>
                      <h3 className="text-lg font-bold text-[#111113] mb-1">{product.name}</h3>
                      <p className="text-base font-bold text-[#8E6D23] tabular-nums">
                        {product.priceMad} درهم
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProductForm(product)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-2 border border-[#111113]/20 text-xs font-semibold hover:bg-[#111113] hover:text-[#FAF9F6] transition-colors rounded-sm cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل السعر والصورة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProduct(product.id)}
                      aria-label={`حذف ${product.name}`}
                      className="min-h-[40px] px-3 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
