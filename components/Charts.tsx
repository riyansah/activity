"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { Activity, Task } from "@/lib/types";
import {
  activityCategoryChartData,
  activityPerDayChartData,
  taskStatusChartData,
  weeklyProgressData
} from "@/lib/utils";

const colors = ["#0f766e", "#2563eb", "#f59e0b", "#e11d48", "#64748b", "#7c3aed", "#16a34a"];

function ChartFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 h-72">{children}</div>
    </section>
  );
}

export function TaskStatusChart({ tasks }: { tasks: Task[] }) {
  const data = taskStatusChartData(tasks);

  return (
    <ChartFrame title="Pekerjaan Berdasarkan Status">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function ActivityPerDayChart({ activities }: { activities: Activity[] }) {
  const data = activityPerDayChartData(activities);

  return (
    <ChartFrame title="Aktivitas Per Hari">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function ActivityCategoryChart({ activities }: { activities: Activity[] }) {
  const data = activityCategoryChartData(activities);

  return (
    <ChartFrame title="Aktivitas Berdasarkan Kategori">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={96} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function WeeklyProgressChart({ tasks }: { tasks: Task[] }) {
  const data = weeklyProgressData(tasks);

  return (
    <ChartFrame title="Progress Mingguan">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="completed" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
