import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../types";

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

type TaskProviderProps = {
  children: ReactNode;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used inside provider");
  return context;
};