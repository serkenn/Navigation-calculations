import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";

const app = new Hono();

// API routes (extensible)
const api = new Hono();
api.get("/health", (c) => c.json({ status: "ok" }));
app.route("/api", api);

// Serve static files from the SvelteKit build
app.use("/*", serveStatic({ root: "./dist" }));

// SPA fallback
app.get("*", serveStatic({ root: "./dist", path: "/index.html" }));

const port = parseInt(process.env.PORT || "3000");
console.log(`Server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
