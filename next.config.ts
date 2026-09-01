import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["10.172.254.110:3000", "10.172.254.110"],
    experimental: {
        // Acelera a compilação do Lucide/UI dentro de rotas dinâmicas no Dev
        optimizePackageImports: [
            "lucide-react",
            "date-fns",
            "@radix-ui/react-icons",
        ],
    },
};

export default nextConfig;
