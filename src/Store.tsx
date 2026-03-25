import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "./types"; // adjust path if needed

// 1. Define Context Type
interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

// 2. Create Context
const TaskContext = createContext<TaskContextType | null>(null);

// 3. Props Type
type TaskProviderProps = {
  children: ReactNode;
};

// 4. Provider
export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev: Task[]) =>
      prev.map((t: Task) =>
        t.id === id ? { ...t, ...updates } : t
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
}

// 5. Hook
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return context;
};