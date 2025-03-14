import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function LoginModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login Here</Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-none md:w-[700px]">
        <VisuallyHidden>
          <DialogTitle>Login Form</DialogTitle>
        </VisuallyHidden>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
