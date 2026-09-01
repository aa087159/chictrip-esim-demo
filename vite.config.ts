import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Dev-only plugin: serves the same /api handlers locally without needing
 * `vercel dev`. In production, Vercel picks up the files in /api directly,
 * so this plugin has no effect there.
 */
function devApi() {
  return {
    name: "dev-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) return next();

        const route = url.split("?")[0];
        const modPath = route.startsWith("/api/recommend")
          ? "/api/_lib/recommend.ts"
          : route.startsWith("/api/chat")
            ? "/api/_lib/chat.ts"
            : null;
        if (!modPath) return next();

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString("utf8");
          const body = raw ? JSON.parse(raw) : {};

          const mod = await server.ssrLoadModule(modPath);
          const fn = route.startsWith("/api/recommend") ? mod.recommend : mod.chat;
          const result = await fn(body);

          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApi()],
});
