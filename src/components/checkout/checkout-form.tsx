"use client";

import { api } from "@/trpc/react";
import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [checkoutError, setCheckoutError] = useState("");
  const {
    data,
    isPending,
    reset,
    mutate: initiatePayment,
  } = api.payments.getCheckoutSession.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    if (!data?.clientSecret) {
      console.error("error submitting payment No client secret yet");
      setCheckoutError("Wait few seconds and try again.");
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.error("error submitting payment:", submitError);
      setCheckoutError(
        submitError.message ??
          "An error occurred while processing your payment.",
      );
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: data.clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      console.error("error confirming payment:", error);
      setCheckoutError(
        error.message ?? "An error occurred while processing your payment.",
      );
      return;
    } else {
      console.log("Payment successful!");
      // You can redirect the user or show a success message here
    }
  };

  if (!stripe || !elements) {
    return null;
  }

  return (
    <>
      {" "}
      <Button
        onClick={() => initiatePayment()}
        className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 py-2 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-600"
      >
        {isPending ? "Processing" : "Pay US"}
      </Button>
      <Dialog open={!!data?.clientSecret} onOpenChange={reset}>
        <DialogContent className="mx-auto text-black max-w-md rounded-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Complete Your Payment
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Secure checkout powered by Stripe
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <PaymentElement />
            {checkoutError && (
              <div className="text-sm text-red-500">{checkoutError}</div>
            )}
            <Button
              disabled={!stripe || isPending}
              type="submit"
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 py-2 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-600"
            >
              {!isPending ? `Pay $${amount}` : "Processing..."}
            </Button>
            {checkoutError && <p>{checkoutError}</p>}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
