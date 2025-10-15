import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Fazer Login",
};

export default function SignInPage() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <SignIn />
    </div>
  );
}
