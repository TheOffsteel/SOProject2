const SOURCE = process.env.SOURCE_URL || "https://soproject.onrender.com/";

function pick(html, label) {
  const re = new RegExp(`${label}:\\s*<\\/strong>\\s*([^<\\n]+)`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function num(s) {
  if (!s) return null;
  const m = s.match(/[\d.,]+/);
  return m ? Number(m[0].replace(/,/g, "")) : null;
}

export async function fetchSnapshot() {
  const r = await fetch(SOURCE, { headers: { accept: "text/html" } });
  const html = await r.text();
  return {
    source: SOURCE,
    hostname: pick(html, "Hostname"),
    platform: pick(html, "Plataforma"),
    arch: pick(html, "Arquitetura"),
    memTotalMB: num(pick(html, "Mem.ria Total")),
    memFreeMB: num(pick(html, "Mem.ria Livre")),
    cpus: num(pick(html, "CPUs")),
    uptimeMinutes: num(pick(html, "Uptime")),
    fetchedAt: new Date().toISOString(),
  };
}
