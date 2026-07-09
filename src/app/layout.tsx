import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
