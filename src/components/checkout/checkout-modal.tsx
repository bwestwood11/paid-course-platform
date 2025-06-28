"use client";

import React from 'react'
import getStripe from '@/lib/stripe/config';
import { Elements } from '@stripe/react-stripe-js';
import convertToSubcurrency from '@/lib/stripe/convert-to-sub-currency';
import { STRIPE_COURSE_PRICE_IN_USD } from '@/lib/stripe/constant';
import { CheckoutForm } from './checkout-form';

const stripe = getStripe()

const CheckoutModal = () => {
  return (
    <div>
        <Elements stripe={stripe} options={{
            mode: 'payment',
            amount: convertToSubcurrency(STRIPE_COURSE_PRICE_IN_USD), // Convert amount to sub-currency format
            currency: 'usd',
            paymentMethodTypes: ['card','klarna', 'afterpay_clearpay', 'affirm',],
            appearance: {
              theme: "stripe",
            }
        }}>
              <CheckoutForm amount={STRIPE_COURSE_PRICE_IN_USD} />
        </Elements>
    </div>
  )
}

export default CheckoutModal;