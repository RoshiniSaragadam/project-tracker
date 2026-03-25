import { useEffect, useState } from "react";

type UserPresence = {
  id: string;
  color: string;
  taskId: string | null;
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export function usePresence(taskIds: string[]) {
  const [users, setUsers] = useState<UserPresence[]>([]);

  // initialize users
  useEffect(() => {
    const initial = Array.from({ length: 3 }, (_, i) => ({
      id: `user-${i}`,
      color: COLORS[i],
      taskId: null,
    }));

    setUsers(initial);
  }, []);

  // simulate movement
  useEffect(() => {
    if (!taskIds.length) return;

    const interval = setInterval(() => {
      setUsers((prev) =>
        prev.map((user) => {
          const randomTask =
            taskIds[Math.floor(Math.random() * taskIds.length)];

          return {
            ...user,
            taskId: randomTask,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [taskIds]);

  return users;
}