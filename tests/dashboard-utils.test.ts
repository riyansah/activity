import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { defaultActivities, defaultSettings, defaultTasks } from "../lib/data";
import { appRoutes } from "../lib/navigation";
import { createDashboardBackup, parseDashboardBackup } from "../lib/storage";
import {
  filterByReportPeriod,
  formatDeadlineCountdown,
  paginateItems,
  sortTasksByNearestDeadline,
  summarizeActivities,
  summarizeTasks,
  toCsv
} from "../lib/utils";
import { validateActivityForm, validateTaskForm } from "../lib/validation";

test("summarizeTasks counts task statuses and completion rate", () => {
  const summary = summarizeTasks(defaultTasks);

  assert.equal(summary.total, 8);
  assert.equal(summary.running, 3);
  assert.equal(summary.completed, 2);
  assert.equal(summary.pending, 2);
  assert.equal(summary.completionRate, 25);
});

test("summarizeActivities finds totals and dominant values", () => {
  const summary = summarizeActivities(defaultActivities);

  assert.equal(summary.total, 20);
  assert.equal(summary.dominantCategory, "Kerja");
  assert.equal(summary.mostFrequentActivity, "Deep work dashboard");
});

test("filterByReportPeriod filters daily activity rows", () => {
  const filtered = filterByReportPeriod(defaultActivities, "2026-06-23", "Harian");

  assert.equal(filtered.length, 7);
});

test("paginateItems returns the first page with range metadata", () => {
  const result = paginateItems(Array.from({ length: 25 }, (_, index) => index + 1), 1, 10);

  assert.deepEqual(result.items, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(result.currentPage, 1);
  assert.equal(result.totalPages, 3);
  assert.equal(result.startItem, 1);
  assert.equal(result.endItem, 10);
});

test("paginateItems clamps pages beyond the available range", () => {
  const result = paginateItems(Array.from({ length: 25 }, (_, index) => index + 1), 9, 10);

  assert.deepEqual(result.items, [21, 22, 23, 24, 25]);
  assert.equal(result.currentPage, 3);
  assert.equal(result.totalPages, 3);
  assert.equal(result.startItem, 21);
  assert.equal(result.endItem, 25);
});

test("paginateItems handles empty lists", () => {
  const result = paginateItems([], 1, 10);

  assert.deepEqual(result.items, []);
  assert.equal(result.currentPage, 1);
  assert.equal(result.totalPages, 1);
  assert.equal(result.startItem, 0);
  assert.equal(result.endItem, 0);
});

test("sortTasksByNearestDeadline keeps only active tasks ordered by nearest deadline", () => {
  const sorted = sortTasksByNearestDeadline(defaultTasks);

  assert.deepEqual(sorted.map((task) => task.id), ["task-4", "task-3", "task-6", "task-1", "task-7"]);
});

test("formatDeadlineCountdown shows detailed future countdown", () => {
  const now = new Date(2026, 5, 23, 12, 0, 0, 0).getTime();

  assert.equal(formatDeadlineCountdown("2026-06-24", now), "1 hari 11 jam 59 menit 59 detik lagi");
});

test("formatDeadlineCountdown shows detailed overdue countdown", () => {
  const now = new Date(2026, 5, 25, 1, 2, 3, 0).getTime();

  assert.equal(formatDeadlineCountdown("2026-06-24", now), "Terlambat 0 hari 1 jam 2 menit 3 detik");
});

test("toCsv escapes quoted values", () => {
  const csv = toCsv([{ metric: "Judul", value: 'A "quoted" value' }]);

  assert.equal(csv, 'metric,value\n"Judul","A ""quoted"" value"');
});

test("validateTaskForm rejects invalid date order", () => {
  const errors = validateTaskForm({
    title: "Tes",
    description: "Valid description",
    status: "Berjalan",
    priority: "Sedang",
    startDate: "2026-06-24",
    deadline: "2026-06-23"
  });

  assert.deepEqual(errors, ["Deadline tidak boleh lebih awal dari tanggal mulai."]);
});

test("validateActivityForm rejects invalid time order", () => {
  const errors = validateActivityForm({
    title: "Tes",
    category: "Kerja",
    date: "2026-06-23",
    startTime: "10:00",
    endTime: "09:00",
    status: "Direncanakan",
    notes: ""
  });

  assert.deepEqual(errors, ["Waktu selesai harus lebih besar dari waktu mulai."]);
});

test("dashboard backup round-trips valid local data", () => {
  const backup = createDashboardBackup(defaultTasks, defaultActivities, defaultSettings, "2026-06-24T00:00:00.000Z");
  const parsed = parseDashboardBackup(JSON.stringify(backup));

  assert.equal(parsed.ok, true);

  if (parsed.ok) {
    assert.equal(parsed.backup.tasks.length, defaultTasks.length);
    assert.equal(parsed.backup.activities.length, defaultActivities.length);
    assert.equal(parsed.backup.settings.dashboardName, defaultSettings.dashboardName);
  }
});

test("dashboard backup rejects invalid task status", () => {
  const backup = createDashboardBackup(defaultTasks, defaultActivities, defaultSettings, "2026-06-24T00:00:00.000Z");
  const invalid = {
    ...backup,
    tasks: [{ ...defaultTasks[0], status: "Tidak Valid" }]
  };

  const parsed = parseDashboardBackup(JSON.stringify(invalid));

  assert.deepEqual(parsed, { ok: false, error: "Isi backup tidak valid." });
});

test("navigation routes have matching app pages", () => {
  for (const route of appRoutes) {
    const pagePath = join(process.cwd(), "app", route.href.slice(1), "page.tsx");
    assert.equal(existsSync(pagePath), true, `${route.href} should have a page file`);
  }
});
