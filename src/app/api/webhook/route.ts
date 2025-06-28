import { headers } from "next/headers";
import { NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";
// import { Resend } from "resend";
// import ChatBuildWelcomeEmail from "@/emails/welcome";
// import ReminderEmail from "@/emails/reminder-email";
// import PausedEmail from "@/emails/paused-subscription";
// import { findPlanNameById, Plans } from "./config";
import { stripe, syncStripeCustomer } from "@/lib/stripe/server-stripe";
import type Stripe from "stripe";

// const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const header = await headers();
  const signature = header.get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Error constructing Stripe event:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }
  await processPaymentIntent(event);
  //   const session = event.data.object as Stripe.Checkout.Session;

  return new NextResponse("Success", { status: 200 });
}

const processPaymentIntent = async (event: Stripe.Event) => {
  if (!allowedEvents.includes(event.type)) {
    return null;
  }
  //   const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const { customer: customerId } = event?.data?.object as {
    customer: string; // Sadly TypeScript does not know this
  };
  if (typeof customerId !== "string") {
    throw new Error(
      "[STRIPE HOOK][CANCER] ID isn't string.\nEvent type: ${event.type}",
    );
  }
  await syncStripeCustomer(customerId);
};

const allowedEvents = [
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
];
