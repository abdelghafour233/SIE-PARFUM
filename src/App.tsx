import { useEffect, useMemo, useState } from 'react';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar, type StoreRoute } from './components/Navbar';
import { OrderPage } from './components/OrderPage';
import { ProductDetailView } from './components/ProductDetailView';
import { ProductsView } from './components/ProductsView';
import { INITIAL_CATALOG_PRODUCTS } from './data/catalogDefaults';
import { subscribeActiveProducts } from './services/storeService';
import type { Product } from './types/store';

export default function App() {
  const [route, setRoute] = useState<StoreRoute>('home');
  const [previousRoute, setPreviousRoute] = useState<StoreRoute>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_CATALOG_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    INITIAL_CATALOG_PRODUCTS[0].id,
  );

  useEffect(() => {
    const unsubscribe = subscribeActiveProducts(
      (items) => {
        if (items.length > 0) {
          setProducts(items);
        }
      },
      () => {
        // Keep initial luxury catalog visible if Firestore read encounters transient issue
      },
    );
    return () => unsubscribe();
  }, []);

  const selectedProduct = useMemo(() => {
    return (
      products.find((p) => p.id === selectedProductId) ||
      products[0] ||
      INITIAL_CATALOG_PRODUCTS[0]
    );
  }, [products, selectedProductId]);

  const relatedPacks = useMemo(() => {
    return products.filter((p) => p.category !== 'single').slice(0, 3);
  }, [products]);

  const navigate = (next: StoreRoute) => {
    setPreviousRoute(route);
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setPreviousRoute(route);
    setRoute('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProductId(product.id);
    setPreviousRoute(route);
    setRoute('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickOrder = () => {
    const defaultPick =
      products.find((p) => p.isBestSeller) || products[0] || INITIAL_CATALOG_PRODUCTS[0];
    handleOrderProduct(defaultPick);
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111113]">
      <Navbar
        activeRoute={route}
        onNavigate={navigate}
        onQuickOrder={handleQuickOrder}
      />

      <main className="flex-1">
        {route === 'home' && (
          <HomeView
            products={products}
            onOrder={handleOrderProduct}
            onViewDetails={handleViewDetails}
            onNavigateToProducts={() => navigate('products')}
            onNavigateToOffers={() => navigate('offers')}
          />
        )}

        {route === 'products' && (
          <ProductsView
            key="all-products"
            products={products}
            initialFilter="all"
            onOrder={handleOrderProduct}
            onViewDetails={handleViewDetails}
          />
        )}

        {route === 'offers' && (
          <ProductsView
            key="offers-packs"
            products={products}
            initialFilter="packs"
            onOrder={handleOrderProduct}
            onViewDetails={handleViewDetails}
          />
        )}

        {route === 'details' && (
          <ProductDetailView
            product={selectedProduct}
            relatedPacks={relatedPacks}
            onOrder={handleOrderProduct}
            onSelectRelated={handleViewDetails}
            onBack={() =>
              navigate(previousRoute === 'offers' ? 'offers' : 'products')
            }
          />
        )}

        {route === 'order' && (
          <OrderPage
            product={selectedProduct}
            onBack={() =>
              navigate(previousRoute === 'order' ? 'home' : previousRoute)
            }
            onBackToStore={() => navigate('home')}
          />
        )}

        {route === 'admin' && <AdminView />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
