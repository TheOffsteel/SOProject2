import { createFileRoute } from "@tanstack/react-router";

const SOURCE = "https://soproject.onrender.com/";

export const Route = createFileRoute("/api/monitor")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch(SOURCE, {
            headers: { accept: "text/html" },
          });
          const html = await res.text();

          const pick = (label: string) => {
            const re = new RegExp(`${label}:\\s*<\\/strong>\\s*([^<\\n]+)`, "i");
            const m = html.match(re);
            return m ? m[1].trim() : null;
          };

          const num = (s: string | null) => {
            if (!s) return null;
            const m = s.match(/[\d.,]+/);
            return m ? Number(m[0].replace(/,/g, "")) : null;
          };

          const data = {
            hostname: pick("Hostname"),
            platform: pick("Plataforma"),
            arch: pick("Arquitetura"),
            memTotalMB: num(pick("Mem(ó|o)ria Total")),
            memFreeMB: num(pick("Mem(ó|o)ria Livre")),
            cpus: num(pick("CPUs")),
            uptimeMinutes: num(pick("Uptime")),
            fetchedAt: new Date().toISOString(),
          };

          return new Response(JSON.stringify(data), {
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 502, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
