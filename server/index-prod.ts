import express from "express";                  // ⬅️ MUST BE FIRST
import compression from "compression";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createHttpServer } from "node:http";
import runApp from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupProd(app) {
  const distPath = path.resolve(__dirname, "..", "dist");

  app.use(compression());
  app.use(express.static(path.resolve(distPath, "client")));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "client", "index.html"));
  });
}

(async () => {
  await runApp(setupProd);
})();
