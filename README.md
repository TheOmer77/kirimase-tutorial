# Kirimase tutorial thing

This is a minimal Linktree clone built with [Next.js](https://nextjs.org/) and [Kirimase](https://kirimase.dev), created by following [this tutorial](https://kirimase.dev/the-tutorial).

This project uses PNPM as its package manager.

## Running the project

First, create an `.env` file with the following content:

```
DATABASE_URL=sqlite.db
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_MAX_PRICE_ID=
NEXT_PUBLIC_STRIPE_ULTRA_PRICE_ID=
```

Fill in the missing Stripe environment variables according to [this part of the tutorial](https://kirimase.dev/the-tutorial#follow-next-steps).

Now run the dev server, at [http://localhost:3000](http://localhost:3000):

```bash
pnpm dev
```
