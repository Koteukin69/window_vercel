import type { Metadata } from "next";
import "../globals.css";

import { Fira_Sans_Condensed } from "next/font/google";

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
    <html lang="ru">
      <body className={firaSansCondensed.className}>
        {children}
      </body>
    </html>
  );
}
