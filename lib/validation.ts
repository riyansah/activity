import type { Activity, Task } from "@/lib/types";

export type TaskFormInput = Pick<Task, "title" | "description" | "status" | "priority" | "startDate" | "deadline">;
export type ActivityFormInput = Pick<
  Activity,
  "title" | "category" | "date" | "startTime" | "endTime" | "status" | "notes"
>;

export function validateTaskForm(input: TaskFormInput) {
  const errors: string[] = [];

  if (input.title.trim().length < 3) {
    errors.push("Judul pekerjaan minimal 3 karakter.");
  }

  if (input.description.trim().length < 5) {
    errors.push("Deskripsi pekerjaan minimal 5 karakter.");
  }

  if (input.deadline < input.startDate) {
    errors.push("Deadline tidak boleh lebih awal dari tanggal mulai.");
  }

  return errors;
}

export function validateActivityForm(input: ActivityFormInput) {
  const errors: string[] = [];

  if (input.title.trim().length < 3) {
    errors.push("Judul aktivitas minimal 3 karakter.");
  }

  if (input.endTime <= input.startTime) {
    errors.push("Waktu selesai harus lebih besar dari waktu mulai.");
  }

  return errors;
}
