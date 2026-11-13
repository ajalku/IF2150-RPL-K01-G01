
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
      // foto laporan yang disajikan backend
      "/uploads": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
    },
  },
});
