import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
          <Icon className="size-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {description && (
        <p className="mt-1 pl-10 text-sm text-slate-400">{description}</p>
      )}
    </div>
  );
}

interface ObservabilitySectionProps {
  children: React.ReactNode;
  className?: string;
}

export function ObservabilitySection({
  children,
  className,
}: ObservabilitySectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-700/40 bg-slate-900/30 p-5 backdrop-blur-md lg:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}
