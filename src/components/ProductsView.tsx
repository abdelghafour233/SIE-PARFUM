import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORY_LABELS, type Product, type ProductCategory } from '../types/store';
import { ProductCard } from './ProductCard';

interface ProductsViewProps {
  products: Product[];
  initialFilter?: 'all' | 'packs' | ProductCategory;
  onOrder: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductsView({
  products,
  initialFilter = 'all',
  onOrder,
  onViewDetails,
}: ProductsViewProps) {
  const [filter, setFilter] = useState<'all' | 'packs' | ProductCategory>(initialFilter);
  const [queryText, setQueryText] = useState('');

  const filtered = useMemo(() => {
    return products.filter((item) => {
      if (filter === 'packs' && item.category === 'single') return false;
      if (filter !== 'all' && filter !== 'packs' && item.category !== filter) return false;

      const q = queryText.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q)
      );
    });
  }, [products, filter, queryText]);

  const filterButtons: { id: 'all' | 'packs' | ProductCategory; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'single', label: CATEGORY_LABELS.single },
    { id: 'packs', label: 'جميع الباقات' },
    { id: 'pack_2', label: CATEGORY_LABELS.pack_2 },
    { id: 'pack_3', label: CATEGORY_LABELS.pack_3 },
    { id: 'pack_4', label: CATEGORY_LABELS.pack_4 },
  ];

  const isOffersMode = initialFilter === 'packs';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10 pb-8 border-b border-[#111113]/10">
        <p className="text-xs font-medium text-[#8E6D23] mb-2">
          {isOffersMode ? 'باقات التوفير الحصرية' : 'كتالوج العطور الفاخرة'}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#111113] mb-4">
          {isOffersMode ? 'عروض الباقات بالدرهم المغربي' : 'جميع العطور والباقات'}
        </h1>
        <p className="text-base text-[#111113]/70 max-w-2xl">
          اختر عطرك المفضل أو باقة التوفير المناسبة لك، واضغط على «اطلب الآن» لإتمام طلبك خلال ثوانٍ مع الدفع عند الاستلام في جميع مدن المغرب.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F2EFE9] p-1 rounded-sm">
          {filterButtons.map((btn) => {
            const active = filter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#111113] text-[#FAF9F6]'
                    : 'text-[#111113]/70 hover:text-[#111113]'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#111113]/45 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="ابحث عن عطر أو مكون..."
            aria-label="ابحث عن عطر"
            className="w-full min-h-[44px] pr-10 pl-4 py-2 bg-white border border-[#111113]/15 text-sm text-[#111113] focus:border-[#B8923A] focus:outline-none rounded-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#111113]/10 p-12 text-center">
          <p className="text-base text-[#111113]/70 mb-4">
            لم يتم العثور على عطور مطابقة لبحثك.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setQueryText('');
            }}
            className="px-5 py-2.5 bg-[#111113] text-[#FAF9F6] text-sm font-medium rounded-sm cursor-pointer"
          >
            إعادة ضبط البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
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
  );
}
