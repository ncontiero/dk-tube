import { Meta } from "@/components/Meta";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
      <Meta path="/sign-in" title="Fazer Login" />
      <div className="my-20 flex items-center justify-center">
        <SignIn
          path="/sign-in"
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
