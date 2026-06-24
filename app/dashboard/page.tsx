"use client";

import { Activity as ActivityIcon, CheckCircle2, Clock3, ListTodo, PauseCircle, Percent } from "lucide-react";
import { ActivityPerDayChart, TaskStatusChart, WeeklyProgressChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { useDashboardStore } from "@/lib/dashboard-store";
import { formatDate, summarizeActivities, summarizeTasks, todayDate } from "@/lib/utils";

export default function DashboardPage() {
  const { tasks, activities, settings } = useDashboardStore();
  const taskSummary = summarizeTasks(tasks);
  const activitySummary = summarizeActivities(activities);
  const latestTasks = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const todayActivities = activities
    .filter((activity) => activity.date === todayDate())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">{settings.dashboardName}</h1>
        <p className="mt-2 text-sm text-slate-500">Ringkasan pekerjaan, aktivitas, dan progress produktivitas.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total pekerjaan" value={taskSummary.total} icon={ListTodo} tone="slate" />
        <StatCard title="Sedang berjalan" value={taskSummary.running} icon={Clock3} tone="blue" />
        <StatCard title="Pekerjaan selesai" value={taskSummary.completed} icon={CheckCircle2} tone="teal" />
        <StatCard title="Pekerjaan tertunda" value={taskSummary.pending} icon={PauseCircle} tone="amber" />
        <StatCard title="Aktivitas hari ini" value={activitySummary.today} icon={ActivityIcon} tone="blue" />
        <StatCard title="Progress penyelesaian" value={`${taskSummary.completionRate}%`} icon={Percent} tone="teal" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <TaskStatusChart tasks={tasks} />
        <ActivityPerDayChart activities={activities} />
        <WeeklyProgressChart tasks={tasks} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Pekerjaan Terbaru</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {latestTasks.map((task) => (
              <div key={task.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-950">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                  </div>
                  <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Deadline {formatDate(task.deadline)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Aktivitas Hari Ini</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {todayActivities.length ? (
              todayActivities.map((activity) => (
                <div key={activity.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {activity.startTime} - {activity.endTime} · {activity.category}
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Belum ada aktivitas untuk hari ini.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
