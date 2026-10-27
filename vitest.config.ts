import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Testes de funções puras (sem DOM): matriz de permissões, avatar, ...
export default defineConfig({
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
