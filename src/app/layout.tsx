import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - AI Resume Builder",
    absolute: "AI Resume Builder",
  },
  description:
    "AI Resume Builder is the easiest way to create a professional resume that will help you land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
        </head>
        <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            // defaultTheme="system"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
