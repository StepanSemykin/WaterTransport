<<<<<<< HEAD
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion"
    ],
  },
  ssr: {
    noExternal: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion"
    ],
  },
});
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
>>>>>>> 1724cd0d76d6c185df29096f799b283048f07944
