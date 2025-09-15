import { Router } from "express";
import fg from "fast-glob";

async function loadAllRoutes() {
  const router = Router();
  const files = await fg(["**/*.route.{ts,js}"], {
    cwd: __dirname,
    ignore: ["index.ts", "index.js"],
  });

  for (const file of files) {
    const module = await import(`./${file}`);
    if (module.default) {
      router.use(module.default);
    }
  }

  return router;
}

export default loadAllRoutes;
