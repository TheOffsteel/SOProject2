import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  Activity,
  Cpu,
  HardDrive,
  Server,
  Clock,
  Layers,
  Zap,
  RefreshCw,
} from "lucide-react";

type MonitorData = {
  hostname: string | null;
  platform: string | null;
  arch: string | null;
  memTotalMB: number | null;
  memFreeMB: number | null;
  cpus: number | null;
  uptimeMinutes: number | null;
  fetchedAt: string;
};

const monitorQuery = queryOptions({
  queryKey: ["monitor"],
  queryFn: async (): Promise<MonitorData> => {
    const res = await fetch("/api/monitor", { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao consultar monitor");
    return res.json();
  },
  refetchInterval: 5000,
  staleTime: 0,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OS Monitor — Painel em tempo real" },
      {
        name: "description",
        content:
          "Monitor de sistemas operacionais com métricas de CPU, memória e uptime em tempo real.",
      },
    ],
  }),
  component: Dashboard,
});

function formatUptime(minutes: number | null) {
  if (minutes == null) return "—";
  const d = Math.floor(minutes / (60 * 24));
  const h = Math.floor((minutes % (60 * 24)) / 60);
  const m = Math.floor(minutes % 60);
  return `${d}d ${h}h ${m}m`;
}

function formatMem(mb: number | null) {
  if (mb == null) return "—";
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function Dashboard() {
  const { data, isFetching, dataUpdatedAt } = useSuspenseQuery(monitorQuery);

  const memUsed =
    data.memTotalMB && data.memFreeMB ? data.memTotalMB - data.memFreeMB : 0;
  const memTotal = data.memTotalMB ?? 1;
  const memPct = Math.round((memUsed / memTotal) * 100);
  const freePct = 100 - memPct;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--ember)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-ember" />
              <span>Sistema Operacional</span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="ember-text-gradient">Monitor</span>
              <span className="text-foreground"> em tempo real</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Telemetria ao vivo do host{" "}
              <span className="font-mono text-foreground">
                soproject.onrender.com
              </span>
              . Atualiza a cada 5 segundos.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-full border border-border bg-surface px-4 py-2 sm:self-end">
            <span
              className={`pulse-dot h-2 w-2 rounded-full ${
                isFetching ? "bg-ember" : "bg-emerald-400"
              }`}
            />
            <span className="font-mono text-xs text-muted-foreground">
              {isFetching ? "atualizando" : "ao vivo"} ·{" "}
              {new Date(dataUpdatedAt).toLocaleTimeString("pt-BR")}
            </span>
            <RefreshCw
              className={`h-3.5 w-3.5 text-muted-foreground ${
                isFetching ? "animate-spin" : ""
              }`}
            />
          </div>
        </header>

        {/* Hostname banner */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex flex-col gap-1 border-b border-border bg-surface-elevated/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md border border-border bg-background p-2">
                <Server className="h-4 w-4 text-ember" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Hostname
                </p>
                <p className="font-mono text-sm text-foreground sm:text-base">
                  {data.hostname ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Pill label="Plataforma" value={data.platform ?? "—"} />
              <Pill label="Arquitetura" value={data.arch ?? "—"} />
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Cpu className="h-5 w-5" />}
            label="CPUs"
            value={data.cpus?.toString() ?? "—"}
            sub="núcleos lógicos"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Uptime"
            value={formatUptime(data.uptimeMinutes)}
            sub={`${data.uptimeMinutes?.toLocaleString("pt-BR") ?? "—"} minutos`}
          />
          <StatCard
            icon={<Layers className="h-5 w-5" />}
            label="Memória total"
            value={formatMem(data.memTotalMB)}
            sub="capacidade do host"
          />
        </div>

        {/* Memory panel */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md border border-border bg-background p-2">
                <HardDrive className="h-4 w-4 text-ember" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Memória RAM
                </p>
                <p className="font-display text-lg font-semibold">
                  {formatMem(memUsed)} / {formatMem(data.memTotalMB)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold ember-text-gradient">
                {memPct}%
              </p>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                em uso
              </p>
            </div>
          </div>

          <div className="relative h-3 w-full overflow-hidden rounded-full bg-background">
            <div
              className="ember-gradient h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${memPct}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <MiniMetric
              label="Em uso"
              value={formatMem(memUsed)}
              accent
            />
            <MiniMetric
              label="Disponível"
              value={`${formatMem(data.memFreeMB)} (${freePct}%)`}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-ember" />
            <span className="font-mono">
              fetched · {new Date(data.fetchedAt).toLocaleString("pt-BR")}
            </span>
          </div>
          <span className="font-mono opacity-60">v1.0</span>
        </footer>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-background px-3 py-1.5">
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}:
      </span>{" "}
      <span className="font-mono text-xs text-foreground">{value}</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-ember/40">
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ background: "var(--ember)" }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-2.5 text-ember">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-sm ${
          accent ? "text-ember" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
