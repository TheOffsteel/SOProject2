/* OS Monitor — front-end vanilla JS
   Consome /api/monitor a cada 5s e atualiza o painel.
   Sem dependências externas — gráficos em SVG inline. */

const HISTORY_MAX = 30;
const history = [];

const $ = (id) => document.getElementById(id);

const fmtMem = (mb) => {
  if (mb == null) return "—";
  return mb >= 1024 ? (mb / 1024).toFixed(1) + " GB" : mb + " MB";
};

const fmtUptime = (m) => {
  if (m == null) return "—";
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = Math.floor(m % 60);
  return `${d}d ${h}h ${mm}m`;
};

function setLive(state, text) {
  const dot = $("liveDot");
  const lbl = $("liveLabel");
  dot.style.background =
    state === "ok" ? "var(--primary)" :
    state === "err" ? "var(--error)" : "var(--ash)";
  lbl.textContent = text;
}

function renderCpuBars(n) {
  const wrap = $("cpuBars");
  wrap.innerHTML = "";
  const count = Math.max(1, Math.min(32, Number(n) || 0));
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.style.height = (40 + Math.round(Math.random() * 60)) + "%";
    wrap.appendChild(b);
  }
}

function renderDonut(pct) {
  const svg = $("memDonut");
  const cx = 80, cy = 80, r = 64, sw = 18;
  const c = 2 * Math.PI * r;
  const used = Math.max(0, Math.min(100, pct || 0));
  const dash = (used / 100) * c;
  svg.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#cccccc" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#76b900" stroke-width="${sw}"
      stroke-dasharray="${dash} ${c - dash}" stroke-dashoffset="${c / 4}"
      transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-family="Inter, Arial"
      font-size="28" font-weight="700" fill="#000">${used}%</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="Inter, Arial"
      font-size="10" font-weight="700" fill="#757575" letter-spacing="1.4">EM USO</text>
  `;
}

function renderHistoryChart() {
  const svg = $("memChart");
  const W = 600, H = 220, pad = 12;
  if (history.length < 2) {
    svg.innerHTML = `<text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-family="Inter, Arial"
      font-size="12" fill="#a7a7a7" letter-spacing="2">COLETANDO AMOSTRAS…</text>`;
    return;
  }
  const data = history.slice(-HISTORY_MAX);
  const step = (W - pad * 2) / (HISTORY_MAX - 1);
  const y = (v) => pad + (H - pad * 2) * (1 - v / 100);

  let path = "";
  let area = `M ${pad} ${H - pad} `;
  data.forEach((v, i) => {
    const x = pad + i * step;
    const yy = y(v);
    path += (i === 0 ? "M" : "L") + ` ${x.toFixed(1)} ${yy.toFixed(1)} `;
    area += `L ${x.toFixed(1)} ${yy.toFixed(1)} `;
  });
  area += `L ${(pad + (data.length - 1) * step).toFixed(1)} ${H - pad} Z`;

  const last = data[data.length - 1];
  const lastX = pad + (data.length - 1) * step;
  const lastY = y(last);

  svg.innerHTML = `
    <line x1="${pad}" y1="${y(50)}" x2="${W - pad}" y2="${y(50)}" stroke="#cccccc" stroke-dasharray="3 4"/>
    <line x1="${pad}" y1="${y(100)}" x2="${W - pad}" y2="${y(100)}" stroke="#cccccc"/>
    <line x1="${pad}" y1="${y(0)}" x2="${W - pad}" y2="${y(0)}" stroke="#cccccc"/>
    <path d="${area}" fill="rgba(118,185,0,0.15)"/>
    <path d="${path}" fill="none" stroke="#76b900" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${lastX}" cy="${lastY}" r="4" fill="#76b900" stroke="#000" stroke-width="1.5"/>
    <text x="${W - pad}" y="${y(100) - 4}" text-anchor="end" font-family="Inter, Arial"
      font-size="10" font-weight="700" fill="#757575" letter-spacing="1">100%</text>
    <text x="${W - pad}" y="${y(0) - 4}" text-anchor="end" font-family="Inter, Arial"
      font-size="10" font-weight="700" fill="#757575" letter-spacing="1">0%</text>
  `;
}

function fillSpec(d, derived) {
  const map = {
    hostname: d.hostname ?? "—",
    platform: d.platform ?? "—",
    arch: d.arch ?? "—",
    cpus: d.cpus ?? "—",
    memTotal: fmtMem(d.memTotalMB),
    memFree: fmtMem(d.memFreeMB),
    uptime: fmtUptime(d.uptimeMinutes),
  };
  document.querySelectorAll("#specTable td[data-k]").forEach((td) => {
    td.textContent = map[td.dataset.k] ?? "—";
  });
}

function update(d) {
  $("hostname").textContent = d.hostname ?? "—";
  $("platform").textContent = d.platform ?? "—";
  $("arch").textContent = d.arch ?? "—";
  try { $("origin").textContent = new URL(d.source).hostname; } catch { $("origin").textContent = d.source || "—"; }

  $("uptime").textContent = fmtUptime(d.uptimeMinutes);
  $("uptimeSub").textContent = (d.uptimeMinutes != null ? d.uptimeMinutes.toLocaleString("pt-BR") : "—") + " minutos";

  $("cpus").textContent = d.cpus ?? "—";
  renderCpuBars(d.cpus);

  const used = (d.memTotalMB && d.memFreeMB != null) ? d.memTotalMB - d.memFreeMB : 0;
  const total = d.memTotalMB || 1;
  const pct = Math.round((used / total) * 100);
  const freePct = 100 - pct;

  $("memLine").textContent = `${fmtMem(used)} / ${fmtMem(d.memTotalMB)}`;
  $("memPct").textContent = pct + "%";
  $("memBar").style.width = pct + "%";
  $("memUsed").textContent = fmtMem(used);
  $("memFree").textContent = fmtMem(d.memFreeMB);
  $("memTotal").textContent = fmtMem(d.memTotalMB);
  $("memFreePct").textContent = freePct + "%";

  $("memTotalBig").textContent = fmtMem(d.memTotalMB);
  $("donutUsed").textContent = `${fmtMem(used)} · ${pct}%`;
  $("donutFree").textContent = `${fmtMem(d.memFreeMB)} · ${freePct}%`;
  renderDonut(pct);

  history.push(pct);
  if (history.length > HISTORY_MAX) history.shift();
  renderHistoryChart();

  fillSpec(d);

  const ts = new Date(d.fetchedAt);
  $("fetchedAt").textContent = "Última leitura · " + ts.toLocaleString("pt-BR");
}

async function tick() {
  setLive("loading", "atualizando…");
  try {
    const r = await fetch("/api/monitor", { cache: "no-store" });
    if (!r.ok) throw new Error("bad status");
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    $("errBox").hidden = true;
    update(d);
    setLive("ok", "ao vivo · " + new Date().toLocaleTimeString("pt-BR"));
  } catch (e) {
    $("errBox").hidden = false;
    setLive("err", "erro de conexão");
  }
}

function clockTick() {
  $("utilClock").textContent = new Date().toLocaleString("pt-BR");
}

document.addEventListener("DOMContentLoaded", () => {
  $("year").textContent = new Date().getFullYear();
  $("refreshBtn").addEventListener("click", tick);
  clockTick();
  setInterval(clockTick, 1000);
  tick();
  setInterval(tick, 5000);
});
