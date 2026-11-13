import { useMemo, useState } from 'react';
import { HERO_CAMPAIGN_IMAGE } from '../data/catalogDefaults';
import { CATEGORY_LABELS, type Product, type ProductCategory } from '../types/store';
import { LuxuryImage } from './LuxuryImage';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  onOrder: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onNavigateToProducts: () => void;
  onNavigateToOffers: () => void;
}

export function HomeView({
  products,
  onOrder,
  onViewDetails,
  onNavigateToProducts,
  onNavigateToOffers,
}: HomeViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ProductCategory>('all');

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'all') {
      return products;
    }
    return products.filter((p) => p.category === selectedFilter);
  }, [products, selectedFilter]);

  const featuredPack = useMemo(() => {
    return (
      products.find((p) => p.category === 'pack_3') ||
      products.find((p) => p.category !== 'single') ||
      products[0]
    );
  }, [products]);

  const filterTabs: { id: 'all' | ProductCategory; label: string }[] = [
    { id: 'all', label: 'جميع العروض' },
    { id: 'single', label: CATEGORY_LABELS.single },
    { id: 'pack_2', label: CATEGORY_LABELS.pack_2 },
    { id: 'pack_3', label: CATEGORY_LABELS.pack_3 },
    { id: 'pack_4', label: CATEGORY_LABELS.pack_4 },
  ];

  return (
    <div>
      {/* Section 1: Luxury Split Hero */}
      <section className="bg-[#0B0B0D] text-[#FAF9F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 px-6 sm:px-10 lg:px-14 py-14 sm:py-20 lg:py-24 flex flex-col justify-center">
            <p className="text-xs font-medium text-[#E5C77A] tracking-wide mb-4">
              دار العنبر · عطور فاخرة في المغرب
            </p>

            <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.2] text-[#FAF9F6] text-balance mb-6">
              عطور فاخرة تُجسّد الحضور الملكي والأصالة المغربية
            </h1>

            <p className="text-base sm:text-lg text-[#FAF9F6]/80 leading-relaxed max-w-xl mb-9">
              تشكيلة منتقاة من أرقى العطور الشرقية والفرنسية بتركيز عالٍ وثبات يدوم طوال اليوم، تصلك إلى باب منزلك في جميع مدن المغرب مع الدفع عند الاستلام.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onNavigateToProducts}
                className="min-h-[48px] px-7 py-3 bg-[#B8923A] text-[#0B0B0D] text-base font-bold hover:bg-[#E5C77A] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
              >
                اكتشف العطور
              </button>
              <button
                type="button"
                onClick={onNavigateToOffers}
                className="min-h-[48px] px-7 py-3 border border-[#FAF9F6]/25 text-[#FAF9F6] text-base font-medium hover:border-[#E5C77A] hover:text-[#E5C77A] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
              >
                باقات التوفير الخاصة
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[540px] bg-[#141418]">
            <LuxuryImage
              src={HERO_CAMPAIGN_IMAGE}
              alt="مجموعة عطور دار العنبر الفاخرة"
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
            <div
              aria-hidden="true"
              className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0B0D] to-transparent pointer-events-none"
            />
          </div>
        </div>

        {/* Full-width 4-column Moroccan COD Trust Strip below Hero */}
        <div className="border-t border-white/10 bg-[#121216]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-white/10">
            <div className="py-5 px-4 text-center sm:text-right">
              <p className="text-sm font-semibold text-[#E5C77A]">الدفع عند الاستلام</p>
              <p className="text-xs text-[#FAF9F6]/65 mt-1">أداء نقدي آمن عند تسلم طلبك</p>
            </div>
            <div className="py-5 px-4 text-center sm:text-right">
              <p className="text-sm font-semibold text-[#E5C77A]">التوصيل لجميع المدن</p>
              <p className="text-xs text-[#FAF9F6]/65 mt-1">شحن سريع ومجاني عبر التراب المغربي</p>
            </div>
            <div className="py-5 px-4 text-center sm:text-right">
              <p className="text-sm font-semibold text-[#E5C77A]">تركيز وثبات عالٍ</p>
              <p className="text-xs text-[#FAF9F6]/65 mt-1">عطور Extrait بنفحات تدوم طويلاً</p>
            </div>
            <div className="py-5 px-4 text-center sm:text-right">
              <p className="text-sm font-semibold text-[#E5C77A]">طلب فوري وسريع</p>
              <p className="text-xs text-[#FAF9F6]/65 mt-1">دون إنشاء حساب أو تعقيد</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Best Sellers & Curated Offers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#111113]/10">
          <div>
            <p className="text-xs font-medium text-[#8E6D23] mb-2">
              الأكثر مبيعاً والعروض الحصرية
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111113]">
              مجموعة العطور والباقات الملكية
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="تصفية العطور والباقات"
            className="flex flex-wrap items-center gap-1.5 bg-[#F2EFE9] p-1 rounded-sm"
          >
            {filterTabs.map((tab) => {
              const active = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#111113] text-[#FAF9F6]'
                      : 'text-[#111113]/70 hover:text-[#111113]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#111113]/10 p-12 text-center">
            <p className="text-base text-[#111113]/70 mb-4">
              لا توجد منتجات مطابقة لهذا التصنيف حالياً.
            </p>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className="px-5 py-2.5 bg-[#111113] text-[#FAF9F6] text-sm font-medium rounded-sm cursor-pointer"
            >
              عرض جميع العطور
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={onOrder}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Featured Bundle Highlight */}
      {featuredPack && (
        <section className="bg-[#F2EFE9] border-t border-[#111113]/10 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 aspect-[4/3] bg-white overflow-hidden border border-[#111113]/10">
              <LuxuryImage
                src={featuredPack.imageUrl}
                alt={featuredPack.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 lg:pr-6">
              <p className="text-xs font-medium text-[#8E6D23] mb-3">
                باقة التوفير المفضلة في المغرب
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111113] mb-4 text-balance">
                {featuredPack.name}
              </h2>
              <p className="text-base text-[#111113]/75 leading-relaxed mb-6">
                {featuredPack.description}
              </p>

              <ul className="space-y-2.5 text-sm text-[#111113]/80 mb-8 border-t border-b border-[#111113]/10 py-5">
                {featuredPack.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#B8923A] font-bold">·</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="block text-xs text-[#111113]/60">السعر الإجمالي بالدرهم</span>
                  <span className="text-3xl font-bold text-[#111113] tabular-nums">
                    {featuredPack.priceMad} درهم
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOrder(featuredPack)}
                  className="min-h-[48px] px-8 py-3.5 bg-[#111113] text-[#FAF9F6] text-base font-semibold hover:bg-[#B8923A] hover:text-[#0B0B0D] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
                >
                  اطلب الباقة الآن
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
