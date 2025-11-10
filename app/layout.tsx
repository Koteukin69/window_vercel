import type { Metadata } from "next";
import "./globals.css";

import { Fira_Sans_Condensed } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ToggleTheme from "@/components/toggle_theme/toggle_theme";

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
      <body className={firaSansCondensed.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <ToggleTheme width={100} />
          <main className="w-full h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
