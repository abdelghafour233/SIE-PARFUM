import { CATEGORY_LABELS, type Product } from '../types/store';
import { LuxuryImage } from './LuxuryImage';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onOrder, onViewDetails }: ProductCardProps) {
  const categoryLabel = CATEGORY_LABELS[product.category];
  const hasSavings =
    typeof product.compareAtPriceMad === 'number' &&
    product.compareAtPriceMad > product.priceMad;

  return (
    <article className="group bg-white border border-[#111113]/10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#B8923A]/60">
      <div>
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="block w-full aspect-[4/3] overflow-hidden bg-[#F2EFE9] cursor-pointer text-right"
        >
          <LuxuryImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>

        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 text-xs text-[#111113]/60 mb-2">
            <span>{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.volumeMl} مل</span>
            {product.isBestSeller && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#8E6D23] font-medium">الأكثر مبيعاً</span>
              </>
            )}
          </div>

          <h3 className="text-xl font-bold text-[#111113] mb-2 leading-snug">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="hover:text-[#B8923A] transition-colors text-right cursor-pointer"
            >
              {product.name}
            </button>
          </h3>

          <p className="text-sm text-[#111113]/70 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-[#111113]/8 mt-auto">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-bold text-[#111113] tabular-nums">
              {product.priceMad} درهم
            </span>
            {hasSavings && (
              <span className="text-sm text-[#111113]/45 line-through tabular-nums">
                {product.compareAtPriceMad} درهم
              </span>
            )}
          </div>
          <span className="text-xs text-[#111113]/55">MAD</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOrder(product)}
            className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#111113] text-[#FAF9F6] text-sm font-semibold hover:bg-[#B8923A] hover:text-[#0B0B0D] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
          >
            اطلب الآن
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="min-h-[44px] px-4 py-2.5 border border-[#111113]/20 text-[#111113] text-sm font-medium hover:border-[#111113] transition-colors rounded-sm whitespace-nowrap cursor-pointer"
          >
            التفاصيل
          </button>
        </div>
      </div>
    </article>
  );
}
