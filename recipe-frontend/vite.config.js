import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to your backend server
      "/api": {
        target: "http://127.0.0.1:8000", // change to your backend URL and port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
