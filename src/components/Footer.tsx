import type { StoreRoute } from './Navbar';

interface FooterProps {
  onNavigate: (route: StoreRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0B0B0D] text-[#FAF9F6] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <p className="font-display text-2xl font-bold text-[#E5C77A] mb-3">
              دار العنبر
            </p>
            <p className="text-sm text-[#FAF9F6]/70 leading-relaxed max-w-sm">
              دار عطور مغربية متخصصة في تركيب أرقى العطور الشرقية والفرنسية بتركيز عالٍ، مع خدمة التوصيل السريع لجميع المدن المغربية والدفع عند الاستلام.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#FAF9F6] mb-4">روابط المتجر</h4>
            <ul className="space-y-2.5 text-sm text-[#FAF9F6]/70">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#E5C77A] transition-colors cursor-pointer"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#E5C77A] transition-colors cursor-pointer"
                >
                  جميع العطور
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('offers')}
                  className="hover:text-[#E5C77A] transition-colors cursor-pointer"
                >
                  باقات التوفير والعروض
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#E5C77A] transition-colors cursor-pointer"
                >
                  إدارة المتجر والطلبات
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#FAF9F6] mb-4">معلومات الشراء والتوصيل</h4>
            <ul className="space-y-2.5 text-sm text-[#FAF9F6]/70">
              <li>العملة المعتمدة: الدرهم المغربي (MAD)</li>
              <li>طريقة الأداء: الدفع نقداً عند الاستلام</li>
              <li>التغطية: توصيل لجميع مدن المغرب</li>
              <li>طلب سريع ومباشر دون الحاجة لإنشاء حساب</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF9F6]/50">
          <p>© {new Date().getFullYear()} دار العنبر للعطور الفاخرة — المملكة المغربية</p>
          <p>الدفع عند الاستلام · التوصيل لجميع المدن</p>
        </div>
      </div>
    </footer>
  );
}
