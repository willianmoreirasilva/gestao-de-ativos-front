import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Funções puras rodam em node; testes de componente declaram jsdom no topo
// do arquivo (// @vitest-environment jsdom)
export default defineConfig({
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.{ts,tsx}"],
    },
});
