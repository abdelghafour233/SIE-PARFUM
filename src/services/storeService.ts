import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import { INITIAL_CATALOG_PRODUCTS } from '../data/catalogDefaults';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { OrderInput, OrderRecord, OrderStatus, Product, ProductCategory } from '../types/store';

function toDateOrNull(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof (value as Timestamp)?.toDate === 'function') {
    return (value as Timestamp).toDate();
  }
  return null;
}

function sanitizeId(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (cleaned.length > 0 && /^[a-zA-Z0-9_\-]+$/.test(cleaned)) {
    return cleaned;
  }
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function subscribeActiveProducts(
  onData: (products: Product[], isFromFirestore: boolean) => void,
  onError?: (err: Error) => void,
) {
  const path = 'products';
  const q = query(collection(db, path), where('isActive', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_CATALOG_PRODUCTS, false);
        return;
      }
      const items: Product[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          name: String(d.name ?? ''),
          subtitle: String(d.subtitle ?? ''),
          description: String(d.description ?? ''),
          notes: String(d.notes ?? ''),
          features: Array.isArray(d.features) ? d.features.map(String) : [],
          priceMad: Number(d.priceMad ?? 0),
          compareAtPriceMad:
            typeof d.compareAtPriceMad === 'number' && d.compareAtPriceMad > 0
              ? d.compareAtPriceMad
              : undefined,
          category: (d.category as ProductCategory) || 'single',
          bottleCount: Number(d.bottleCount ?? 1),
          volumeMl: Number(d.volumeMl ?? 100),
          imageUrl: String(d.imageUrl ?? ''),
          isBestSeller: Boolean(d.isBestSeller),
          isActive: Boolean(d.isActive),
          sortOrder: Number(d.sortOrder ?? 100),
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });
      items.sort((a, b) => a.sortOrder - b.sortOrder);
      onData(items, true);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    },
  );
}

export function subscribeAllProductsAdmin(
  onData: (products: Product[]) => void,
  onError?: (err: Error) => void,
) {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Product[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          name: String(d.name ?? ''),
          subtitle: String(d.subtitle ?? ''),
          description: String(d.description ?? ''),
          notes: String(d.notes ?? ''),
          features: Array.isArray(d.features) ? d.features.map(String) : [],
          priceMad: Number(d.priceMad ?? 0),
          compareAtPriceMad:
            typeof d.compareAtPriceMad === 'number' && d.compareAtPriceMad > 0
              ? d.compareAtPriceMad
              : undefined,
          category: (d.category as ProductCategory) || 'single',
          bottleCount: Number(d.bottleCount ?? 1),
          volumeMl: Number(d.volumeMl ?? 100),
          imageUrl: String(d.imageUrl ?? ''),
          isBestSeller: Boolean(d.isBestSeller),
          isActive: Boolean(d.isActive),
          sortOrder: Number(d.sortOrder ?? 100),
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });
      items.sort((a, b) => a.sortOrder - b.sortOrder);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    },
  );
}

export async function saveProduct(
  input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  existingId?: string,
  existingCreatedAt?: unknown,
): Promise<string> {
  const productId = existingId
    ? sanitizeId(existingId)
    : `prod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const path = `products/${productId}`;

  const cleanFeatures = input.features
    .map((f) => f.trim().slice(0, 120))
    .filter((f) => f.length > 0)
    .slice(0, 8);

  if (cleanFeatures.length === 0) {
    cleanFeatures.push('عطر فاخر بتركيز عالٍ وثبات طويل');
  }

  const basePayload: Record<string, unknown> = {
    name: input.name.trim().slice(0, 120),
    subtitle: input.subtitle.trim().slice(0, 120),
    description: input.description.trim().slice(0, 1500),
    notes: input.notes.trim().slice(0, 200),
    features: cleanFeatures,
    priceMad: Math.max(1, Math.min(50000, Number(input.priceMad))),
    category: input.category,
    bottleCount: Math.max(1, Math.min(4, Math.round(Number(input.bottleCount)))),
    volumeMl: Math.max(10, Math.min(500, Math.round(Number(input.volumeMl)))),
    imageUrl: input.imageUrl.trim().slice(0, 1000),
    isBestSeller: Boolean(input.isBestSeller),
    isActive: Boolean(input.isActive),
    sortOrder: Math.max(0, Math.min(10000, Math.round(Number(input.sortOrder || 0)))),
    updatedAt: serverTimestamp(),
  };

  if (
    typeof input.compareAtPriceMad === 'number' &&
    input.compareAtPriceMad > 0 &&
    input.compareAtPriceMad <= 100000
  ) {
    basePayload.compareAtPriceMad = Number(input.compareAtPriceMad);
  }

  try {
    if (existingId && existingCreatedAt) {
      await updateDoc(doc(db, 'products', productId), basePayload);
    } else {
      await setDoc(doc(db, 'products', productId), {
        ...basePayload,
        createdAt: serverTimestamp(),
      });
    }
    return productId;
  } catch (error) {
    handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedInitialProductsToFirestore(): Promise<void> {
  const path = 'products';
  try {
    const batch = writeBatch(db);
    for (const item of INITIAL_CATALOG_PRODUCTS) {
      const ref = doc(db, 'products', item.id);
      const payload: Record<string, unknown> = {
        name: item.name.slice(0, 120),
        subtitle: item.subtitle.slice(0, 120),
        description: item.description.slice(0, 1500),
        notes: item.notes.slice(0, 200),
        features: item.features.slice(0, 8),
        priceMad: item.priceMad,
        category: item.category,
        bottleCount: item.bottleCount,
        volumeMl: item.volumeMl,
        imageUrl: item.imageUrl,
        isBestSeller: item.isBestSeller,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (typeof item.compareAtPriceMad === 'number' && item.compareAtPriceMad > 0) {
        payload.compareAtPriceMad = item.compareAtPriceMad;
      }
      batch.set(ref, payload);
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function submitCodOrder(input: OrderInput): Promise<string> {
  const fullName = input.fullName.trim().slice(0, 100);
  const city = input.city.trim().slice(0, 80);
  const phone = input.phone.trim().slice(0, 20);

  if (fullName.length < 2) {
    throw new Error('يرجى إدخال الاسم الكامل بشكل صحيح.');
  }
  if (city.length < 2) {
    throw new Error('يرجى اختيار أو كتابة المدينة.');
  }
  if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
    throw new Error('يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678).');
  }

  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const path = `orders/${orderId}`;
  const safeProductId = sanitizeId(input.product.id);

  const payload = {
    fullName,
    city,
    phone,
    productId: safeProductId,
    productName: input.product.name.trim().slice(0, 150),
    productCategory: input.product.category,
    priceMad: Math.max(1, Math.min(50000, Number(input.product.priceMad))),
    paymentMethod: 'cod' as const,
    status: 'new' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'orders', orderId), payload);
    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeOrdersAdmin(
  onData: (orders: OrderRecord[]) => void,
  onError?: (err: Error) => void,
) {
  const path = 'orders';
  const q = query(collection(db, path), where('paymentMethod', '==', 'cod'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: OrderRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          fullName: String(d.fullName ?? ''),
          city: String(d.city ?? ''),
          phone: String(d.phone ?? ''),
          productId: String(d.productId ?? ''),
          productName: String(d.productName ?? ''),
          productCategory: (d.productCategory as ProductCategory) || 'single',
          priceMad: Number(d.priceMad ?? 0),
          paymentMethod: 'cod',
          status: (d.status as OrderStatus) || 'new',
          createdAt: toDateOrNull(d.createdAt),
          updatedAt: toDateOrNull(d.updatedAt),
        };
      });
      list.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    },
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
