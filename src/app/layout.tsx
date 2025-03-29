'use client';
import Header from "./components/layout/Header";
import { AppProvider } from "./components/AppContext";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { metadata } from "../app/metadata"; 

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <SessionProvider>
          <AppProvider>
            <Toaster />
            <Header />
            <main className="max-w-5xl mx-auto p-4">{children}</main>
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </footer>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
