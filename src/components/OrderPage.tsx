import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { submitCodOrder } from '../services/storeService';
import { CATEGORY_LABELS, MOROCCAN_CITIES, type Product } from '../types/store';
import { LuxuryImage } from './LuxuryImage';

interface OrderPageProps {
  product: Product;
  onBack: () => void;
  onBackToStore: () => void;
}

export function OrderPage({ product, onBack, onBackToStore }: OrderPageProps) {
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const orderId = await submitCodOrder({
        fullName,
        city,
        phone,
        product,
      });
      setConfirmedOrderId(orderId);
    } catch (err) {
      const message =
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'تعذر إرسال الطلب حالياً. يرجى التحقق من البيانات والمحاولة مجدداً.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrderId) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="bg-white border border-[#B8923A]/40 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#111113] text-[#E5C77A] flex items-center justify-center rounded-full">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111113] mb-4 leading-snug">
            شكراً على طلبك! سنتصل بك قريباً لتأكيد طلبك.
          </h1>

          <p className="text-sm text-[#111113]/70 mb-8">
            تم تسجيل طلبك بنجاح بنظام الدفع عند الاستلام. سيتواصل معك فريق التوصيل لتأكيد الموعد في مدينتك.
          </p>

          <div className="bg-[#FAF9F6] border border-[#111113]/10 p-6 text-right space-y-3 mb-8 text-sm">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#111113]/10">
              <span className="text-[#111113]/60">المنتج المختار</span>
              <span className="font-semibold text-[#111113]">{product.name}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#111113]/10">
              <span className="text-[#111113]/60">الثمن عند الاستلام</span>
              <span className="font-bold text-[#111113] tabular-nums">
                {product.priceMad} درهم (MAD)
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#111113]/10">
              <span className="text-[#111113]/60">الاسم الكامل</span>
              <span className="font-medium text-[#111113]">{fullName}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#111113]/10">
              <span className="text-[#111113]/60">المدينة</span>
              <span className="font-medium text-[#111113]">{city}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#111113]/60">رقم الهاتف</span>
              <span dir="ltr" className="font-medium text-[#111113] tabular-nums">
                {phone}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToStore}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#111113] text-[#FAF9F6] text-base font-semibold hover:bg-[#B8923A] hover:text-[#0B0B0D] transition-colors rounded-sm cursor-pointer"
          >
            العودة إلى المتجر
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#111113]/70 hover:text-[#111113] mb-8 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>رجوع</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selected Product / Offer Summary (Automatically populated) */}
        <aside className="lg:col-span-5 bg-white border border-[#111113]/10 p-6">
          <p className="text-xs font-medium text-[#8E6D23] mb-4">
            المنتج أو العرض المختار
          </p>

          <div className="flex items-center gap-4 pb-5 border-b border-[#111113]/10">
            <div className="w-24 h-20 shrink-0 bg-[#F2EFE9] overflow-hidden">
              <LuxuryImage
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#111113]/60 mb-1">
                {CATEGORY_LABELS[product.category]} · {product.volumeMl} مل
              </p>
              <h2 className="text-lg font-bold text-[#111113] leading-snug">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="py-5 space-y-3 border-b border-[#111113]/10 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#111113]/70">السعر</span>
              <span className="font-semibold text-[#111113] tabular-nums">
                {product.priceMad} درهم
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#111113]/70">التوصيل لجميع مدن المغرب</span>
              <span className="font-medium text-[#8E6D23]">مجاني</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#111113]/70">طريقة الدفع</span>
              <span className="font-medium text-[#111113]">الدفع عند الاستلام</span>
            </div>
          </div>

          <div className="pt-5 flex items-baseline justify-between">
            <span className="text-base font-bold text-[#111113]">المجموع الواجب أداؤه</span>
            <span className="text-2xl font-bold text-[#111113] tabular-nums">
              {product.priceMad} درهم
            </span>
          </div>
        </aside>

        {/* Simple 3-Field Fast Order Form */}
        <div className="lg:col-span-7 bg-white border border-[#111113]/10 p-6 sm:p-10">
          <h1 className="font-display text-3xl font-bold text-[#111113] mb-2">
            إتمام الطلب السريع
          </h1>
          <p className="text-sm text-[#111113]/70 mb-8">
            أدخل معلوماتك الثلاثة فقط لتأكيد طلبك، والدفع نقداً عند الاستلام في مدينتك.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="order-fullname"
                className="block text-sm font-semibold text-[#111113] mb-2"
              >
                الاسم الكامل <span className="text-[#B8923A]">*</span>
              </label>
              <input
                id="order-fullname"
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: كريم بنعلي"
                className="w-full min-h-[48px] px-4 py-3 bg-[#FAF9F6] border border-[#111113]/20 text-[#111113] text-base focus:border-[#B8923A] focus:outline-none rounded-sm"
              />
            </div>

            <div>
              <label
                htmlFor="order-city"
                className="block text-sm font-semibold text-[#111113] mb-2"
              >
                المدينة <span className="text-[#B8923A]">*</span>
              </label>
              <input
                id="order-city"
                type="text"
                list="moroccan-cities"
                required
                minLength={2}
                maxLength={80}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="اختر أو اكتب مدينتك (الدار البيضاء، الرباط، مراكش...)"
                className="w-full min-h-[48px] px-4 py-3 bg-[#FAF9F6] border border-[#111113]/20 text-[#111113] text-base focus:border-[#B8923A] focus:outline-none rounded-sm"
              />
              <datalist id="moroccan-cities">
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                htmlFor="order-phone"
                className="block text-sm font-semibold text-[#111113] mb-2"
              >
                رقم الهاتف <span className="text-[#B8923A]">*</span>
              </label>
              <input
                id="order-phone"
                type="tel"
                dir="ltr"
                required
                minLength={8}
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full min-h-[48px] px-4 py-3 bg-[#FAF9F6] border border-[#111113]/20 text-[#111113] text-base text-right focus:border-[#B8923A] focus:outline-none rounded-sm tabular-nums"
              />
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-sm"
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[56px] px-6 py-4 bg-[#111113] text-[#FAF9F6] text-lg font-bold hover:bg-[#B8923A] hover:text-[#0B0B0D] disabled:opacity-60 transition-colors rounded-sm cursor-pointer"
            >
              {submitting ? 'جاري تسجيل طلبك...' : 'تأكيد الطلب'}
            </button>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#111113]/65">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#B8923A]" />
                التوصيل لجميع مدن المغرب
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B8923A]" />
                الدفع نقداً عند الاستلام
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
