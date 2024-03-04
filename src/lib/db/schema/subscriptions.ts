import {
  sqliteTable,
  primaryKey,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';

export const subscriptions = sqliteTable(
  'subscriptions',
  {
    userId: text('user_id').unique(),
    stripeCustomerId: text('stripe_customer_id').unique(),
    stripeSubscriptionId: text('stripe_subscription_id').unique(),
    stripePriceId: text('stripe_price_id'),
    stripeCurrentPeriodEnd: integer('stripe_current_period_end', {
      mode: 'timestamp',
    }),
  },
  table => {
    return {
      pk: primaryKey(table.userId, table.stripeCustomerId),
    };
  }
);
