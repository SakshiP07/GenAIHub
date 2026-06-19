"use client";

import { cn } from "@/lib/utils";

interface ArchitectureDiagramProps {
  nodes: { id: string; label: string; type: string }[];
  edges: string[][];
}

const typeColors: Record<string, string> = {
  source: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  infra: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  compute: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  ai: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  data: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  monitor: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  logs: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  security: "border-red-500/40 bg-red-500/10 text-red-300",
  cicd: "border-pink-500/40 bg-pink-500/10 text-pink-300",
  iac: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
};

export function ArchitectureDiagram({ nodes, edges }: ArchitectureDiagramProps) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const layers = [
    ["users"],
    ["lb", "gateway"],
    ["k8s", "jenkins", "terraform"],
    ["inference", "vectordb"],
    ["prometheus", "grafana", "elk", "vault"],
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex min-w-[600px] flex-col items-center gap-4">
        {layers.map((layer, li) => (
          <div key={li} className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap justify-center gap-3">
              {layer.map((id) => {
                const node = nodeMap[id];
                if (!node) return null;
                return (
                  <div
                    key={id}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-center text-xs font-medium transition-all hover:scale-105",
                      typeColors[node.type] ?? typeColors.infra
                    )}
                  >
                    {node.label}
                  </div>
                );
              })}
            </div>
            {li < layers.length - 1 && (
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-4 w-px bg-slate-600" />
                <div className="size-0 border-x-4 border-t-8 border-x-transparent border-t-slate-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2 border-t border-slate-700/50 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {edges.slice(0, 6).map(([from, to]) => (
          <div
            key={`${from}-${to}`}
            className="flex items-center gap-2 text-xs text-slate-500"
          >
            <span className="text-slate-400">{nodeMap[from]?.label}</span>
            <span className="text-cyan-500">→</span>
            <span className="text-slate-400">{nodeMap[to]?.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
