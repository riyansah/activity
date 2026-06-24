import assert from "node:assert/strict";
import test from "node:test";
import { defaultActivities, defaultTasks } from "../lib/data";
import { filterByReportPeriod, summarizeActivities, summarizeTasks, toCsv } from "../lib/utils";
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
