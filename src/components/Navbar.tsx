import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type StoreRoute = 'home' | 'products' | 'offers' | 'details' | 'order' | 'admin';

interface NavbarProps {
  activeRoute: StoreRoute;
  onNavigate: (route: StoreRoute) => void;
  onQuickOrder: () => void;
}

export function Navbar({ activeRoute, onNavigate, onQuickOrder }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: StoreRoute; label: string }[] = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'العطور' },
    { id: 'offers', label: 'العروض' },
    { id: 'admin', label: 'إدارة المتجر' },
  ];

  const handleNav = (route: StoreRoute) => {
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <>
      {/* Slim announcement marquee bar (non-sticky to respect mobile sticky height cap) */}
      <div className="bg-[#0B0B0D] text-[#E5C77A] h-9 overflow-hidden border-b border-white/10 flex items-center">
        <div className="marquee-track text-xs font-medium tracking-wide whitespace-nowrap">
          <div className="flex items-center gap-8 px-4">
            <span>التوصيل لجميع مدن المغرب والدفع عند الاستلام</span>
            <span aria-hidden="true" className="text-[#B8923A]">•</span>
            <span>عطور فاخرة بالدرهم المغربي بتركيز عالٍ وثبات طويل</span>
            <span aria-hidden="true" className="text-[#B8923A]">•</span>
            <span>تخفيضات حصرية على باقات العطرين و3 و4 عطور</span>
            <span aria-hidden="true" className="text-[#B8923A]">•</span>
          </div>
          <div className="flex items-center gap-8 px-4" aria-hidden="true">
            <span>التوصيل لجميع مدن المغرب والدفع عند الاستلام</span>
            <span className="text-[#B8923A]">•</span>
            <span>عطور فاخرة بالدرهم المغربي بتركيز عالٍ وثبات طويل</span>
            <span className="text-[#B8923A]">•</span>
            <span>تخفيضات حصرية على باقات العطرين و3 و4 عطور</span>
            <span className="text-[#B8923A]">•</span>
          </div>
        </div>
      </div>

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#111113]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="font-display text-2xl font-bold text-[#111113] hover:text-[#B8923A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            دار العنبر
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#111113]/75"
          >
            {navItems.map((item) => {
              const isActive =
                activeRoute === item.id ||
                (item.id === 'products' && activeRoute === 'details');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#111113] border-[#B8923A]'
                      : 'border-transparent hover:text-[#111113] hover:border-[#111113]/25'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onQuickOrder();
              }}
              className="px-5 py-2.5 text-sm font-semibold bg-[#111113] text-[#FAF9F6] hover:bg-[#B8923A] hover:text-[#0B0B0D] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              اطلب الآن
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileOpen}
              className="md:hidden w-11 h-11 flex items-center justify-center text-[#111113] hover:bg-[#111113]/5 rounded-sm cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#FAF9F6] border-t border-[#111113]/10 px-4 py-4">
            <nav aria-label="قائمة الهاتف" className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full text-right px-3 py-3 text-base font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'bg-[#111113]/5 text-[#B8923A]'
                        : 'text-[#111113] hover:bg-[#111113]/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
