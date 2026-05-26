import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const SOURCE = process.env.SOURCE_URL || "https://soproject.onrender.com/";

app.get("/api/monitor", async (_req, res) => {
  try {
    const r = await fetch(SOURCE, { headers: { accept: "text/html" } });
    const html = await r.text();

    const pick = (label) => {
      const re = new RegExp(`${label}:\\s*<\\/strong>\\s*([^<\\n]+)`, "i");
      const m = html.match(re);
      return m ? m[1].trim() : null;
    };
    const num = (s) => {
      if (!s) return null;
      const m = s.match(/[\d.,]+/);
      return m ? Number(m[0].replace(/,/g, "")) : null;
    };

    res.set("cache-control", "no-store").json({
      hostname: pick("Hostname"),
      platform: pick("Plataforma"),
      arch: pick("Arquitetura"),
      memTotalMB: num(pick("Mem(ó|o)ria Total")),
      memFreeMB: num(pick("Mem(ó|o)ria Livre")),
      cpus: num(pick("CPUs")),
      uptimeMinutes: num(pick("Uptime")),
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`OS Monitor rodando em http://localhost:${PORT}`);
});
