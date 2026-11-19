import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const auth = Buffer.from(`${env.TICKET_TAILOR_API_KEY}:`).toString("base64");
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api/tt": {
          target: "https://api.tickettailor.com/v1",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/tt/, ""),
          headers: { Authorization: `Basic ${auth}` },
        },
      },
    },
  };
});
