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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${roboto.variable} antialiased min-h-screen flex flex-col`}>
        <SessionProvider>
          <AppProvider>
            <div className="flex flex-col min-h-screen overflow-x-hidden">
              <Toaster />
              <Header />
              <main className="flex-grow max-w-6xl mx-auto px-4 w-full">{children}</main>
              <footer className="border-t p-8 text-center text-gray-500 mt-16">
                &copy; {new Date().getFullYear()} All Rights Reserved
              </footer>
            </div>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
