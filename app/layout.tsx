import type { Metadata } from "next";
import "./globals.css";
import { Fira_Sans_Condensed } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { ToggleTheme, Back } from "@/components";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import AuthModal from "@/components/auth_modal/auth_modal";

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
      <body className={firaSansCondensed.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <FavoritesProvider>
              <Back />
              <ToggleTheme />
              <AuthModal />
              <main className="w-full h-screen flex justify-center items-center">
                {children}
              </main>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
