import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import { Header } from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "rgb(139 92 246)" },
      }}
      localization={ptBR}
      {...pageProps}
    >
      <Header />
      <div className="pb-[90px] pt-14">
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
}
