import { SignUp } from "@clerk/nextjs";
import { Meta } from "@/components/Meta";

export default function SignUpPage() {
  return (
    <>
      <Meta path="/sign-up" title="Criar Conta" />
      <div className="my-20 flex items-center justify-center">
        <SignUp
          path="/sign-up"
          routing="path"
          appearance={{
            elements: {
              card: "bg-zinc-900/70 border border-zinc-700",
              socialButtonsBlockButton:
                "hover:bg-violet-600/10 focus:bg-violet-600/30 duration-300",
              formButtonPrimary:
                "bg-violet-600/60 hover:bg-violet-600/80 duration-300",
            },
          }}
        />
      </div>
    </>
  );
}
