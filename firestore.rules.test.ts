/**
 * Dirty Dozen Security Specification Verification Suite for firestore.rules
 * Covers the 12 adversarial payloads defined in security_spec.md.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const dirtyDozenCases: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Order Read',
    collection: 'orders',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unauthenticated Order List',
    collection: 'orders',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Signed-In Non-Admin Order List',
    collection: 'orders',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Order Ghost Field Injection',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      fullName: 'يوسف العلوي',
      city: 'الدار البيضاء',
      phone: '0612345678',
      productId: 'oud_malaki',
      productName: 'عود الملكي',
      productCategory: 'single',
      priceMad: 299,
      paymentMethod: 'cod',
      status: 'new',
      isPaid: true,
    },
  },
  {
    id: 5,
    name: 'Order Status Bypass on Create',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      fullName: 'يوسف العلوي',
      city: 'الرباط',
      phone: '0612345678',
      productId: 'oud_malaki',
      productName: 'عود الملكي',
      productCategory: 'single',
      priceMad: 299,
      paymentMethod: 'cod',
      status: 'delivered',
    },
  },
  {
    id: 6,
    name: 'Order Payment Method Spoof',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      fullName: 'سلمى بنعلي',
      city: 'مراكش',
      phone: '0612345678',
      productId: 'oud_malaki',
      productName: 'عود الملكي',
      productCategory: 'single',
      priceMad: 299,
      paymentMethod: 'free',
      status: 'new',
    },
  },
  {
    id: 7,
    name: 'Order Client Timestamp Spoof',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      fullName: 'سلمى بنعلي',
      city: 'طنجة',
      phone: '0612345678',
      productId: 'oud_malaki',
      productName: 'عود الملكي',
      productCategory: 'single',
      priceMad: 299,
      paymentMethod: 'cod',
      status: 'new',
      createdAt: '2020-01-01T00:00:00Z',
    },
  },
  {
    id: 8,
    name: 'Order Oversized Phone Poisoning',
    collection: 'orders',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      fullName: 'خالد',
      city: 'فاس',
      phone: '0'.repeat(150),
      productId: 'oud_malaki',
      productName: 'عود الملكي',
      productCategory: 'single',
      priceMad: 299,
      paymentMethod: 'cod',
      status: 'new',
    },
  },
  {
    id: 9,
    name: 'Public Product Creation',
    collection: 'products',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unverified Admin Email Spoof',
    collection: 'orders',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Product Ghost Field Update',
    collection: 'products',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: {
      extraField: 'malicious',
    },
  },
  {
    id: 12,
    name: 'Self-Assigned Admin Escalation',
    collection: 'admins',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      email: 'attacker@example.com',
      role: 'admin',
    },
  },
];
