import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import "./globals.css";
import { Fira_Sans_Condensed } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { ToggleTheme, Back } from "@/components";

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ["cyrillic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Посмотри в Окно"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="description" content="Большая библиотека видео из разных городов России" />
      </head>
      <body className={firaSansCondensed.className}><StackProvider app={stackClientApp}><StackTheme>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <Back />  
          <ToggleTheme />
          <main className="w-full h-screen flex justify-center items-center">
            {children}
          </main>
        </ThemeProvider>
      </StackTheme></StackProvider></body>
    </html>
  );
}
