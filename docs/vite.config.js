import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/frames/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        templates: resolve(__dirname, "templates/index.html"),
        guides: resolve(__dirname, "guides/index.html"),
      },
    },
  },
});
