import { getCurrentUser } from "@/lib/auth";
import { syncStripeCustomer } from "@/lib/stripe/server-stripe";
import React from "react";
import { stripe } from "@/lib/stripe/server-stripe";
import {
  CheckCircle,
  CreditCard,
  Mail,
  Play,
  ArrowRight,
  MessageCircle,
  BookOpen,
  Clock,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock data  in a real app, this would come from props or API
const paymentData = {
  transactionId: "TXN-2024-001234",
  total: 297.0,
  date: "January 15, 2024",
  email: "customer@example.com",
  courseName: "Complete Web Development Masterclass",
  courseDescription:
    "Master modern web development with React, Node.js, and more",
  totalVideos: 150,
  totalHours: 45,
  accessType: "Lifetime Access",
};

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string }>;
}) {
  const user = await getCurrentUser(true);
  const { payment_intent } = await searchParams;
  if (!payment_intent) {
    return <p>Are you sure you coming from Stripe?</p>;
  }
  const paymentDetails = await stripe.paymentIntents.retrieve(payment_intent);
  if (!paymentDetails) {
    return <p>Payment details not found.</p>;
  }
  if (!user?.user.stripeCustomerId) {
    return <div>You can not view this page.</div>;
  }
  await syncStripeCustomer(user?.user.stripeCustomerId);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Success Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4 shadow-lg">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Payment Successful!
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-foreground/60">
            Welcome to your learning journey! Your course access has been
            activated and you can start learning immediately.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          {/* Course Access Card - Takes up 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <BookOpen className="h-6 w-6 text-green-600" />
                Your Course is Ready!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">
                  {paymentData.courseName}
                </h2>
                <p className="mb-4 text-foreground/60">
                  {paymentData.courseDescription}
                </p>

                <div className="mb-6 flex flex-wrap gap-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    {paymentData.totalVideos} Videos
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {paymentData.totalHours} Hours
                  </Badge>
                  <Badge variant="default" className="bg-green-600">
                    {paymentData.accessType}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="flex-1">
                  <Play className="mr-2 h-5 w-5" />
                  Start Learning Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Course Outline
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    txn_{paymentDetails.id.replace(/^pi_/, "").slice(0, 10)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Date:</span>
                  <span className="text-sm font-semibold">
                    {new Date(paymentDetails.created * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Email:</span>
                  <span className="text-sm font-semibold">
                    {user.user.email}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg">
                <span className="font-semibold">Amount Paid:</span>
                <span className="text-xl font-bold text-green-600">
                  ${(paymentDetails.amount_received/100).toFixed(2)}
                </span>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-center text-sm font-medium text-green-800">
                  ✓ Payment Confirmed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Next Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="rounded-full bg-blue-100 p-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Check Your Email</h3>
                  <p className="text-sm text-foreground/70">
                    Receipt of purchase has been sent to {user.user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Start Learning</h3>
                  <p className="text-sm text-foreground/70">
                    Access all course content immediately with your lifetime
                    membership. Visit your dashboard to begin.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Follow the Path</h3>
                  <p className="text-sm text-foreground/70">
                    Begin with the introduction and follow our structured
                    learning path
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support and Additional Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold">
                  Need Help Getting Started?
                </h3>
                <p className="text-sm text-foreground/70">
                  Our support team is ready to help you begin your learning
                  journey
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Live Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold">Explore More Learning</h3>
                <p className="text-sm text-foreground/70">
                  Discover additional courses to expand your skillset
                </p>
                <Button asChild className="w-full">
                  <Link href="/courses">
                    Browse All Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">
              Transaction #txn_{paymentDetails.id.replace(/^pi_/, "")}
            </span>
          </div>
          <p className="text-foreground/70">
            Thank you for investing in your education! We&apos;re excited to be
            part of your learning journey.
          </p>
        </div>
      </div>
    </div>
  );
}
