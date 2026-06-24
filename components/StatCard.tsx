import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  tone?: "teal" | "blue" | "amber" | "rose" | "slate";
}

const tones = {
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-slate-100 text-slate-700"
};

export function StatCard({ title, value, description, icon: Icon, tone = "slate" }: StatCardProps) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        {Icon ? (
          <div className={`flex h-11 w-11 items-center justify-center rounded ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {description ? <p className="mt-3 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}
