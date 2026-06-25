import { activityCategories, activityStatuses, taskPriorities, taskStatuses } from "@/lib/types";
import type { Activity, DashboardSettings, Task } from "@/lib/types";

export interface DashboardBackup {
  version: 1;
  exportedAt: string;
  tasks: Task[];
  activities: Activity[];
  settings: DashboardSettings;
}

export function createDashboardBackup(
  tasks: Task[],
  activities: Activity[],
  settings: DashboardSettings,
  exportedAt = new Date().toISOString()
): DashboardBackup {
  return {
    version: 1,
    exportedAt,
    tasks,
    activities,
    settings
  };
}

export function parseDashboardBackup(value: string): { ok: true; backup: DashboardBackup } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (!isRecord(parsed) || parsed.version !== 1) {
      return { ok: false, error: "File backup tidak didukung." };
    }

    if (
      !isString(parsed.exportedAt) ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.activities) ||
      !isDashboardSettings(parsed.settings)
    ) {
      return { ok: false, error: "Struktur backup tidak valid." };
    }

    if (!parsed.tasks.every(isTask) || !parsed.activities.every(isActivity)) {
      return { ok: false, error: "Isi backup tidak valid." };
    }

    return {
      ok: true,
      backup: {
        version: 1,
        exportedAt: parsed.exportedAt,
        tasks: parsed.tasks,
        activities: parsed.activities,
        settings: parsed.settings
      }
    };
  } catch {
    return { ok: false, error: "File backup bukan JSON yang valid." };
  }
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.title) &&
    isString(value.description) &&
    includesValue(taskStatuses, value.status) &&
    includesValue(taskPriorities, value.priority) &&
    isString(value.startDate) &&
    isString(value.deadline) &&
    (isString(value.completedAt) || value.completedAt === null) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

function isActivity(value: unknown): value is Activity {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.title) &&
    includesValue(activityCategories, value.category) &&
    isString(value.date) &&
    isString(value.startTime) &&
    isString(value.endTime) &&
    includesValue(activityStatuses, value.status) &&
    isString(value.notes) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
}

function isDashboardSettings(value: unknown): value is DashboardSettings {
  if (!isRecord(value) || !Array.isArray(value.preferredCategories)) {
    return false;
  }

  return (
    isString(value.dashboardName) &&
    isString(value.accountName) &&
    isString(value.accountEmail) &&
    includesValue(["Terang", "Gelap", "Sistem"], value.theme) &&
    value.preferredCategories.every((category) => includesValue(activityCategories, category))
  );
}

function includesValue<T extends string>(items: readonly T[], value: unknown): value is T {
  return typeof value === "string" && items.includes(value as T);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
