import { LoginModal } from "@/components/auth/login-modal";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const AuthErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) => {
  return (
     //TODO: Improve the UI and error message of this page
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-3 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Error Encountered
      </h1>
      <p className="mb-6 text-xl text-muted-foreground">
        {(await searchParams).error}
      </p>

      <div className="max-w-md space-y-4">
        <p className="text-muted-foreground">
          We apologize for the inconvenience. This error might be temporary or
          may require you to log in to access this resource.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <LoginModal />
      </div>
    </div>
  );
};

export default AuthErrorPage;
