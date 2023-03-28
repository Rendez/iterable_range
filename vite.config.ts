import { defineConfig } from "vite";

export default defineConfig({
    define: {
        "import.meta.vitest": "undefined",
    },
    test: {
        includeSource: ["src/index.ts"],
    },
});
