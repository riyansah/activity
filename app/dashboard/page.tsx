"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity as ActivityIcon, CheckCircle2, Clock3, ListTodo, PauseCircle, Percent } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { ActivityPerDayChart, TaskStatusChart, WeeklyProgressChart } from "@/components/Charts";
import { StatCard } from "@/components/StatCard";
import { useDashboardStore } from "@/lib/dashboard-store";
import {
  formatDate,
  formatDeadlineCountdown,
  paginateItems,
  sortTasksByNearestDeadline,
  summarizeActivities,
  summarizeTasks,
  todayDate,
  useNow
} from "@/lib/utils";

const dashboardPageSize = 4;

export default function DashboardPage() {
  const { tasks, activities, settings } = useDashboardStore();
  const [taskPage, setTaskPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const now = useNow();
  const taskSummary = summarizeTasks(tasks);
  const activitySummary = summarizeActivities(activities);
  const nearestDeadlineTasks = useMemo(() => sortTasksByNearestDeadline(tasks), [tasks]);
  const todayActivities = useMemo(
    () =>
      activities
        .filter((activity) => activity.date === todayDate())
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [activities]
  );
  const paginatedTasks = useMemo(
    () => paginateItems(nearestDeadlineTasks, taskPage, dashboardPageSize),
    [nearestDeadlineTasks, taskPage]
  );
  const paginatedActivities = useMemo(
    () => paginateItems(todayActivities, activityPage, dashboardPageSize),
    [activityPage, todayActivities]
  );

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
          <h2 className="text-base font-semibold text-slate-950">Deadline Terdekat</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {paginatedTasks.totalItems ? (
              paginatedTasks.items.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks?taskId=${task.id}`}
                  className="block rounded py-3 first:pt-0 last:pb-0 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-950">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                    </div>
                    <span className="shrink-0 rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                      {task.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-slate-500">Deadline {formatDate(task.deadline)}</p>
                    <p className="font-medium text-amber-700">{now === null ? "Memuat hitung mundur..." : formatDeadlineCountdown(task.deadline, now)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">Belum ada pekerjaan aktif dengan deadline.</p>
            )}
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={paginatedTasks.currentPage}
              totalPages={paginatedTasks.totalPages}
              totalItems={paginatedTasks.totalItems}
              startItem={paginatedTasks.startItem}
              endItem={paginatedTasks.endItem}
              onPageChange={setTaskPage}
            />
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Aktivitas Hari Ini</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {paginatedActivities.totalItems ? (
              paginatedActivities.items.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/activities?activityId=${activity.id}`}
                  className="block rounded py-3 first:pt-0 last:pb-0 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-950">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {activity.startTime} - {activity.endTime} · {activity.category}
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
                      {activity.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">Belum ada aktivitas untuk hari ini.</p>
            )}
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={paginatedActivities.currentPage}
              totalPages={paginatedActivities.totalPages}
              totalItems={paginatedActivities.totalItems}
              startItem={paginatedActivities.startItem}
              endItem={paginatedActivities.endItem}
              onPageChange={setActivityPage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
