import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("./certs/localhost+2-key.pem"),
      cert: fs.readFileSync("./certs/localhost+2.pem"),
    },
    port: 3001,
    proxy: {
      "/api": { target: "https://localhost:7038", changeOrigin: true, secure: false }
    }
  }
});