import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Criar Conta",
};

export default function SignUpPage() {
  return (
    <div className="flex size-full items-center justify-center py-20">
      <SignUp />
    </div>
  );
}
