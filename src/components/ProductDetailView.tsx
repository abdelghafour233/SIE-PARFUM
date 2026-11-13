import { ArrowRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { CATEGORY_LABELS, type Product } from '../types/store';
import { LuxuryImage } from './LuxuryImage';

interface ProductDetailViewProps {
  product: Product;
  relatedPacks: Product[];
  onOrder: (product: Product) => void;
  onSelectRelated: (product: Product) => void;
  onBack: () => void;
}

export function ProductDetailView({
  product,
  relatedPacks,
  onOrder,
  onSelectRelated,
  onBack,
}: ProductDetailViewProps) {
  const hasSavings =
    typeof product.compareAtPriceMad === 'number' &&
    product.compareAtPriceMad > product.priceMad;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-24 lg:pb-16">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#111113]/70 hover:text-[#111113] mb-8 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى العطور</span>
      </button>

      {/* Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Sticky Media Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="aspect-[4/3] bg-[#F2EFE9] border border-[#111113]/10 overflow-hidden">
            <LuxuryImage
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Purchase Details */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 text-xs text-[#8E6D23] font-medium mb-3">
            <span>{CATEGORY_LABELS[product.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{product.volumeMl} مل</span>
            <span aria-hidden="true">·</span>
            <span>متوفر للشحن الفوري</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111113] mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 pb-6 mb-6 border-b border-[#111113]/10">
            <span className="text-3xl font-bold text-[#111113] tabular-nums">
              {product.priceMad} درهم
            </span>
            {hasSavings && (
              <span className="text-lg text-[#111113]/45 line-through tabular-nums">
                {product.compareAtPriceMad} درهم
              </span>
            )}
            <span className="text-xs text-[#111113]/55">MAD</span>
          </div>

          <p className="text-base text-[#111113]/80 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="bg-[#F2EFE9] p-4 mb-6 border border-[#111113]/8">
            <p className="text-xs font-semibold text-[#111113]/60 mb-1">
              الهرم والمكونات العطرية
            </p>
            <p className="text-sm font-medium text-[#111113]">{product.notes}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-bold text-[#111113] mb-3">مميزات العطر</h2>
            <ul className="space-y-2.5 text-sm text-[#111113]/80">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B8923A] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onOrder(product)}
            className="w-full min-h-[54px] px-8 py-4 bg-[#111113] text-[#FAF9F6] text-lg font-bold hover:bg-[#B8923A] hover:text-[#0B0B0D] transition-colors rounded-sm cursor-pointer mb-4"
          >
            اطلب الآن — {product.priceMad} درهم
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#111113]/75 pt-2">
            <div className="flex items-center gap-2 bg-white border border-[#111113]/10 p-3">
              <Truck className="w-4 h-4 text-[#B8923A] shrink-0" />
              <span>التوصيل مجاني لجميع مدن المغرب</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#111113]/10 p-3">
              <ShieldCheck className="w-4 h-4 text-[#B8923A] shrink-0" />
              <span>الدفع نقداً عند الاستلام دون حساب</span>
            </div>
          </div>

          {/* Upgrade to Bundle Packs Option */}
          {product.category === 'single' && relatedPacks.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#111113]/10">
              <h3 className="text-sm font-bold text-[#111113] mb-3">
                وفّر أكثر مع باقات العطور المتعددة
              </h3>
              <div className="space-y-2.5">
                {relatedPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="flex items-center justify-between gap-4 bg-white border border-[#111113]/10 p-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111113] truncate">
                        {pack.name}
                      </p>
                      <p className="text-xs text-[#111113]/60">
                        {CATEGORY_LABELS[pack.category]} · {pack.priceMad} درهم
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectRelated(pack)}
                      className="px-3.5 py-2 border border-[#111113]/20 text-xs font-semibold text-[#111113] hover:bg-[#111113] hover:text-[#FAF9F6] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      عرض الباقة
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Sticky Mobile Buy Bar (<= 15% mobile viewport height) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#111113]/15 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-[#111113]/60 truncate">{product.name}</p>
          <p className="text-base font-bold text-[#111113] tabular-nums">
            {product.priceMad} درهم
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOrder(product)}
          className="min-h-[44px] px-6 py-2.5 bg-[#111113] text-[#FAF9F6] text-sm font-bold rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          اطلب الآن
        </button>
      </div>
    </section>
  );
}
