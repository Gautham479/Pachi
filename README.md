## Getting Started

Install dependencies and run the development server:

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Panel

Use the admin panel to add/remove products and mark products in stock/out of stock.

1. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Log in with credentials from `.env`
3. Manage products from the dashboard (no code changes required)

Default local env values:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
ADMIN_SESSION_TOKEN="change-me-admin-session-token"
DATABASE_URL="file:./dev.db"
```

## API

- Public products: `GET /api/products`
- Product detail: `GET /api/products/:slug`
- Admin login: `POST /api/admin/login`
- Admin product management: `GET/POST /api/admin/products`
- Admin update/delete: `PATCH/DELETE /api/admin/products/:id`

## Notes

- First API read seeds the database with default products if empty.
- Keep `ADMIN_SESSION_TOKEN` strong in production.
