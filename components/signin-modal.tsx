"use client";
import { SignIn } from "@clerk/nextjs";

import useSignInModal from "@/hooks/use-signin-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SignInModal = () => {
  const { isOpen, handleClose } = useSignInModal();
  const fallbackUrl = process.env.NEXT_PUBLIC_APP_URL;
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-fit px-0 !bg-transparent !border-0 !shadow-none">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <SignIn routing="hash" fallbackRedirectUrl={`${fallbackUrl}`} />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
