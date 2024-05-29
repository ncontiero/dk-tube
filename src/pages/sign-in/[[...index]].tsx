import { SignIn } from "@clerk/nextjs";
import { Meta } from "@/components/Meta";

export default function SignInPage() {
  return (
    <>
      <Meta path="/sign-in" title="Fazer Login" />
      <div className="my-20 flex items-center justify-center">
        <SignIn />
      </div>
    </>
  );
}
