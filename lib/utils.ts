"use client";

import { useEffect, useState } from "react";
import type {
  Activity,
  ActivityCategory,
  ActivitySummary,
  ReportPeriod,
  Task,
  TaskStatus,
  TaskSummary
} from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function nowIso() {
  return new Date().toISOString();
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);

    if (stored) {
      try {
        setValue(JSON.parse(stored) as T);
      } catch {
        setValue(fallback);
      }
    }

    setLoaded(true);
  }, [fallback, key]);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, loaded, value]);

  return [value, setValue] as const;
}

export function summarizeTasks(tasks: Task[]): TaskSummary {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "Selesai").length;
  const running = tasks.filter((task) => task.status === "Berjalan").length;
  const pending = tasks.filter((task) => task.status === "Tertunda").length;
  const canceled = tasks.filter((task) => task.status === "Dibatalkan").length;
  const today = todayDate();
  const overdue = tasks.filter(
    (task) => task.deadline < today && task.status !== "Selesai" && task.status !== "Dibatalkan"
  ).length;

  return {
    total,
    running,
    completed,
    pending,
    canceled,
    overdue,
    completionRate: total ? Math.round((completed / total) * 100) : 0
  };
}

export function summarizeActivities(activities: Activity[]): ActivitySummary {
  const today = todayDate();
  const categoryCounts = countBy(activities, "category");
  const titleCounts = countBy(activities, "title");

  return {
    total: activities.length,
    today: activities.filter((activity) => activity.date === today).length,
    dominantCategory: topEntry(categoryCounts) as ActivityCategory | "-",
    mostFrequentActivity: topEntry(titleCounts) || "-"
  };
}

export function countBy<T, K extends keyof T>(items: T[], key: K) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const value = String(item[key]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export function topEntry(counts: Record<string, number>) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
}

export function taskStatusChartData(tasks: Task[]) {
  const counts = countBy(tasks, "status");
  const statuses: TaskStatus[] = ["Berjalan", "Selesai", "Tertunda", "Dibatalkan"];
  return statuses.map((status) => ({ name: status, value: counts[status] || 0 }));
}

export function activityCategoryChartData(activities: Activity[]) {
  const counts = countBy(activities, "category");
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function activityPerDayChartData(activities: Activity[]) {
  const counts = countBy(activities, "date");
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, total]) => ({ date: formatDate(date), total }));
}

export function weeklyProgressData(tasks: Task[]) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });

  return days.map((date) => {
    const completed = tasks.filter((task) => task.completedAt?.slice(0, 10) === date).length;
    return { date: formatDate(date), completed };
  });
}

export function filterByReportPeriod<T extends { date?: string; createdAt: string }>(
  items: T[],
  selectedDate: string,
  period: ReportPeriod
) {
  return items.filter((item) => {
    const value = item.date || item.createdAt.slice(0, 10);

    if (period === "Harian") {
      return value === selectedDate;
    }

    if (period === "Bulanan") {
      return value.slice(0, 7) === selectedDate.slice(0, 7);
    }

    return getWeekKey(value) === getWeekKey(selectedDate);
  });
}

export function getWeekKey(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOffset = Math.floor((date.getTime() - firstDay.getTime()) / 86400000);
  const week = Math.ceil((dayOffset + firstDay.getDay() + 1) / 7);
  return `${date.getFullYear()}-${week}`;
}

export function toCsv(rows: Array<Record<string, string | number | null>>) {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;

  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}
