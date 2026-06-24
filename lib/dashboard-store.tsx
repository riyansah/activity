"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { activityStorageKey, defaultActivities, defaultSettings, defaultTasks, settingsStorageKey, taskStorageKey } from "@/lib/data";
import type { Activity, DashboardSettings, Task } from "@/lib/types";
import { useLocalStorageState } from "@/lib/utils";

interface DashboardDataContextValue {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  settings: DashboardSettings;
  setSettings: Dispatch<SetStateAction<DashboardSettings>>;
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorageState(taskStorageKey, defaultTasks);
  const [activities, setActivities] = useLocalStorageState(activityStorageKey, defaultActivities);
  const [settings, setSettings] = useLocalStorageState(settingsStorageKey, defaultSettings);

  const value = useMemo(
    () => ({ tasks, setTasks, activities, setActivities, settings, setSettings }),
    [activities, setActivities, settings, setSettings, tasks, setTasks]
  );

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardStore() {
  const value = useContext(DashboardDataContext);

  if (!value) {
    throw new Error("useDashboardStore must be used inside DashboardDataProvider");
  }

  return value;
}
