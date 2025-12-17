import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src", // project root
  envDir: "src", // .env inside src
  build: {
    outDir: "../dist", // ⬅️ output dist outside src
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/pages/about.html"),
        contact: resolve(__dirname, "src/pages/contact.html"),
        desktop: resolve(__dirname, "src/pages/desktop.html"),
        mobile: resolve(__dirname, "src/pages/mobile.html"),
        portfolios: resolve(__dirname, "src/pages/portfolios.html"),
        product: resolve(__dirname, "src/pages/product.html"),
        review: resolve(__dirname, "src/pages/review.html"),
        signup: resolve(__dirname, "src/pages/signup.html"),
        siteplan: resolve(__dirname, "src/pages/siteplan.html"),
        thanks: resolve(__dirname, "src/pages/thanks.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        logout: resolve(__dirname, "src/pages/logout.html"),
        dashboard: resolve(__dirname, "src/pages/dashboard.html"),
        newproject: resolve(__dirname, "src/pages/new-project.html"),
        profile: resolve(__dirname, "src/pages/profile.html"),
        register: resolve(__dirname, "src/pages/register.html"),
        analytics: resolve(__dirname, "src/pages/analytics.html"),
      },
    },
  },
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@js": resolve(__dirname, "src/js"),
    },
  },
});
