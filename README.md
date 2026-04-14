## Getting Started

Install dependencies:

```bash
npm install
```

Set env vars in `.env` (Supabase):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
SUPABASE_STORAGE_BUCKET="product-images"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
ADMIN_SESSION_TOKEN="change-me-admin-session-token"
```

Apply schema and run:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Panel

Use the admin panel to add/remove products and mark products in stock/out of stock.

1. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Log in with credentials from `.env`
3. Manage products from the dashboard (no code changes required)

## API

- Public products: `GET /api/products`
- Product detail: `GET /api/products/:slug`
- Admin login: `POST /api/admin/login`
- Admin product management: `GET/POST /api/admin/products`
- Admin update/delete: `PATCH/DELETE /api/admin/products/:id`

## Notes

- First API read seeds the database with default products if empty.
- Keep `ADMIN_SESSION_TOKEN` strong in production.
- In Supabase Storage, create bucket `product-images` and mark it public (or configure signed URL flow).
