import { db } from "@/server/db";
import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});

export const syncStripeCustomer = async (customerId: string) => {
  const payments = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 5,
  });

  const successfulPayments = payments.data.filter(
    (payment) => payment.status === "succeeded",
  );

  if (successfulPayments.length > 0) {
    const payment = successfulPayments[0];
    if (!payment?.amount_received) {
      console.error("No successful payment found for customer:", customerId);
      return;
    }
    await db.user.update({
      where: {
        stripeCustomerId: customerId,
      },
      data: {
        amountPaid: Math.floor(payment.amount_received / 100),
        datePaid: new Date(payment.created * 1000), // Assuming the first payment is the most recent
      },
    });
  }
};
