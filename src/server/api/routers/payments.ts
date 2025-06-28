import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { stripe } from "@/lib/stripe/server-stripe";
import { STRIPE_COURSE_PRICE_IN_USD } from "@/lib/stripe/constant";
import convertToSubcurrency from "@/lib/stripe/convert-to-sub-currency";

export const paymentRouter = createTRPCRouter({
  getCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user?.email)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You need to put your email before subscription",
        cause: "User email is missing",
      });

    let customerId = user.stripeCustomerId;
    if (!user.stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? "Anonymous",
        metadata: {
          userId: user.id, // DO NOT FORGET THIS
        },
      });

      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: newCustomer.id },
      });

      customerId = newCustomer.id;
    }

    if (!customerId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Something Went wrong",
        cause: "STRIPE_ISSUE",
      });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToSubcurrency(STRIPE_COURSE_PRICE_IN_USD),
      currency: "usd",
      payment_method_types: ["card", "klarna", "afterpay_clearpay", "affirm"],
      customer: customerId,
    });

    return { clientSecret: paymentIntent.client_secret };
  }),
});
