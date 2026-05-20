import type { Metadata } from "next";
import { Bebas_Neue, Lora, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthInitializer } from "@/components/auth-initializer";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movyra - Cinema at Your Fingertips",
  description: "A curated streaming experience. Discover films, series, and documentaries that move you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bebas.variable} ${lora.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
