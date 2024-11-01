import type { ReactNode } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";

interface UnauthorizedPageProps {
  readonly icon?: ReactNode;
  readonly title: string;
  readonly description: string;
}

export function UnauthorizedPage({
  icon,
  title,
  description,
}: UnauthorizedPageProps) {
  return (
    <main className="mt-20 flex flex-col items-center justify-center text-center">
      {icon}
      <h1 className="mt-6 text-2xl font-bold tracking-wide">{title}</h1>
      <p className="mt-4 text-base">{description}</p>
      <p className="mt-6 text-base">
        <Button asChild className="gap-2 rounded-full" variant="outline">
          <Link href="/sign-in">
            <LogIn />
            Fazer login
          </Link>
        </Button>
      </p>
    </main>
  );
}
