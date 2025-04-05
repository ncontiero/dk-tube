import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Criar Conta",
};

export default function SignUpPage() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <SignUp />
    </div>
  );
}
