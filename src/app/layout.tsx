import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "NetManager",
};

// Configura a fonte Inter
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <head />
            {/* Extensões do navegador (ex.: ColorZilla) injetam atributos no body */}
            <body
                className={`${inter.className} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
