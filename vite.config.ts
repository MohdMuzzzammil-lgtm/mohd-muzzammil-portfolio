// Static (SPA) build. Works on both GitHub Pages and Vercel:
// - GitHub Pages serves from /<repo-name>/, so the base must match the repo name.
// - Vercel sets the VERCEL env var and serves from the root, so base is "/".
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const base = process.env.VERCEL ? "/" : "/mohd-muzzammil-portfolio/";

export default defineConfig({
  nitro: false,
  tanstackStart: { spa: { enabled: true } },
  vite: { base },
});
