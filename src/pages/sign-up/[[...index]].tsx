import { SignUp } from "@clerk/nextjs";
import { Meta } from "@/components/Meta";

export default function SignUpPage() {
  return (
    <>
      <Meta path="/sign-up" title="Criar Conta" />
      <div className="my-20 flex items-center justify-center">
        <SignUp />
      </div>
    </>
  );
}
