# Gugan Furniture Deployment

This project is ready for a client demo on Vercel with Supabase as the backend.

## Local Environment

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase project values:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

When these values are missing, the app runs in fast local demo mode using the built-in furniture catalog.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase_setup.sql`.
4. Create public storage buckets:
   - `products`
   - `banners`
5. Keep both buckets public for the demo so product and banner images render directly.

## Vercel Setup

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add these environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy.

`vercel.json` already includes the SPA rewrite, so routes like `/shop` and `/product/demo-45` work on refresh.

## Demo Notes

The current RLS policies allow demo writes for products, orders and homepage config through the browser client. That is useful for showing admin/CMS behavior to a client. Before real production, tighten write policies to allow only admin users.
