import { getCurrentUser } from "@/lib/auth";
import { syncStripeCustomer } from "@/lib/stripe/server-stripe";
import React from "react";

const PaymentSucceeded = async () => {
  const user = await getCurrentUser(true);
  if (!user?.user.stripeCustomerId) {
    return <div>You can not view this page.</div>;
  }
  await syncStripeCustomer(user?.user.stripeCustomerId);
  return <div></div>;
};

export default PaymentSucceeded;
