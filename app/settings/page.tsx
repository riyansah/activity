"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { useDashboardStore } from "@/lib/dashboard-store";
import type { ActivityCategory, ThemePreference } from "@/lib/types";
import { activityCategories } from "@/lib/types";

const themes: ThemePreference[] = ["Terang", "Gelap", "Sistem"];

export default function SettingsPage() {
  const { settings, setSettings } = useDashboardStore();
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function toggleCategory(category: ActivityCategory) {
    setSettings((current) => {
      const exists = current.preferredCategories.includes(category);
      return {
        ...current,
        preferredCategories: exists
          ? current.preferredCategories.filter((item) => item !== category)
          : [...current.preferredCategories, category]
      };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Pengaturan</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Preferensi Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Pengaturan lokal sederhana tanpa login.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 rounded border border-slate-200 bg-white p-5 shadow-sm">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Nama dashboard</span>
          <input
            value={settings.dashboardName}
            onChange={(event) => setSettings((current) => ({ ...current, dashboardName: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Tema tampilan</span>
          <select
            value={settings.theme}
            onChange={(event) => setSettings((current) => ({ ...current, theme: event.target.value as ThemePreference }))}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">Preferensi kategori aktivitas</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {activityCategories.map((category) => (
              <label key={category} className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.preferredCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-teal-700"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Nama akun lokal</span>
            <input
              value={settings.accountName}
              onChange={(event) => setSettings((current) => ({ ...current, accountName: event.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Email lokal</span>
            <input
              type="email"
              value={settings.accountEmail}
              onChange={(event) => setSettings((current) => ({ ...current, accountEmail: event.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            <Save className="h-4 w-4" />
            Simpan pengaturan
          </button>
          {saved ? <span className="text-sm font-medium text-teal-700">Pengaturan tersimpan.</span> : null}
        </div>
      </form>
    </div>
  );
}
