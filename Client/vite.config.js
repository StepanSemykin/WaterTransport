// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": "http://localhost:5053",
//     },
//   },
//   plugins: [react()],
// })

import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    // https: {
    //   key: fs.readFileSync("./certs/localhost+2-key.pem"),
    //   cert: fs.readFileSync("./certs/localhost+2.pem"),
    // },
    port: 3001,
    proxy: {
      "/api": { target: "https://localhost:7038", changeOrigin: true, secure: false }
    }
  }
});