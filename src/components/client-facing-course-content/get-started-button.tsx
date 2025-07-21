"use client";

import React from "react";
import { Button } from "../ui/button";
import type { Session } from "next-auth";
import Link from "next/link";
import { api } from "@/trpc/react";
import {  useRouter } from "next/navigation";



const GetStartedButton = ({session, courseId}: {session: Session | null, courseId: string}) => {
  const router = useRouter()
  const {mutate} = api.courses.startedCourse.useMutation({
      onSuccess:() => { 
        router.push(`./continue`)
      }
  })

    const getStarted = () => {
        if (session?.user.datePaid) {
           mutate({ courseId })
        }
    }
  return (
    <>
      <Button variant="default" onClick={getStarted} className="w-full py-3 text-lg font-bold">
        {!session && "Login to get started"}
        {!session?.user.datePaid && !!session && "Purchase to get started"}
        {!!session?.user.datePaid && !!session && "Get Started"}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Already purchased?{" "}
        <Link href="/login" className="text-primary underline">
          Sign in
        </Link>{" "}
        to access your course.
      </p>
    </>
  );
};

export default GetStartedButton;
