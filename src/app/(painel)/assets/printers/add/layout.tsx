import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova impressora" };

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
