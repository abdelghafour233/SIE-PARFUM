# Security Specification — Dar Al-Anbar Storefront

## 1. Data Invariants
1. **PII Isolation (Orders)**: Customer orders (`/orders/{orderId}`) contain PII (`fullName`, `city`, `phone`). Unauthenticated visitors can create new orders (`status == 'new'`, `paymentMethod == 'cod'`), while `get`, `list`, `update`, and `delete` are strictly denied to everyone except verified store admins (`isAdmin()`).
2. **Product Catalog Integrity**: Only verified store admins can create, update, or delete `/products/{productId}`. Unauthenticated shoppers can only read active products (`isActive == true`).
3. **No Ghost Fields or Spoofed Timestamps**: Every `create` enforces `keys().hasAll(...)` and `keys().hasOnly(...)` along with `createdAt == request.time` and `updatedAt == request.time`. Every `update` enforces `affectedKeys().hasOnly(...)` and `createdAt == existing().createdAt`.
4. **Verified Admin Email Enforcement**: Admin checks require `request.auth != null && request.auth.token.email_verified == true`.
5. **Terminal State Protection**: Orders cannot be modified by non-admins, and admins follow strict schema validation on status updates (`new`, `confirmed`, `shipped`, `delivered`, `cancelled`).

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Order Read**: Unauthenticated `get(/orders/ord_1)` -> Denied (PII protection).
2. **Unauthenticated Order List**: Unauthenticated `list(/orders)` -> Denied (PII scraping prevention).
3. **Signed-In Non-Admin Order List**: Signed-in non-admin user `list(/orders)` -> Denied.
4. **Order Ghost Field Injection**: Public `create(/orders/ord_1)` with extra field `isPaid: true` -> Denied (`hasOnly` check).
5. **Order Status Bypass on Create**: Public `create(/orders/ord_1)` with `status: 'delivered'` instead of `'new'` -> Denied.
6. **Order Payment Method Spoof**: Public `create(/orders/ord_1)` with `paymentMethod: 'free'` -> Denied.
7. **Order Client Timestamp Spoof**: Public `create(/orders/ord_1)` with forged `createdAt` != `request.time` -> Denied.
8. **Order Oversized Phone/Resource Poisoning**: Public `create(/orders/ord_1)` with 200-char phone or invalid ID `../bad` -> Denied (`isValidId` + regex + size bounds).
9. **Public Product Creation**: Non-admin `create(/products/prod_1)` -> Denied.
10. **Unverified Admin Email Spoof**: User with `email == 'abdelghaforbahaddou@gmail.com'` and `email_verified: false` reading `/orders` -> Denied.
11. **Product Ghost Field Update**: Admin `update(/products/prod_1)` modifying `createdAt` or injecting `extraField: 1` -> Denied.
12. **Self-Assigned Admin Escalation**: Non-admin `create(/admins/{uid})` with `{ role: 'admin' }` -> Denied.
