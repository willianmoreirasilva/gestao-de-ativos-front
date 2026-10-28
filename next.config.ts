import type { NextConfig } from "next";

// Hosts extras que podem abrir o servidor de desenvolvimento (acesso pela
// rede), separados por vírgula. Só vale no `pnpm dev`.
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

const nextConfig: NextConfig = {
    allowedDevOrigins,
    experimental: {
        // Upload de avatar: arquivo original de até 5 MB + margem do multipart
        serverActions: {
            bodySizeLimit: "6mb",
        },
        // Acelera a compilação do Lucide/UI dentro de rotas dinâmicas no Dev
        optimizePackageImports: [
            "lucide-react",
            "date-fns",
            "@radix-ui/react-icons",
        ],
    },
};

export default nextConfig;
