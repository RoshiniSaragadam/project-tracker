import { useMemo, useState } from "react";
import { useTasks } from "../store/useTaskStore";
import type { Task, Status } from "../types";

const ROW_HEIGHT = 50;

type SortKey = "title" | "priority" | "dueDate";
type SortOrder = "asc" | "desc";

const priorityRank: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// small helper (keeps JSX clean)
function getPriorityStyles(priority: string) {
  if (priority === "critical") {
    return { bg: "#fee2e2", color: "#b91c1c" };
  }
  if (priority === "high") {
    return { bg: "#fef3c7", color: "#92400e" };
  }
  if (priority === "medium") {
    return { bg: "#e0e7ff", color: "#3730a3" };
  }
  return { bg: "#f3f4f6", color: "#374151" };
}

export default function ListView() {
  const { tasks, updateTask } = useTasks();

  const [scrollTop, setScrollTop] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedTasks = useMemo(() => {
    const list = [...tasks];

    list.sort((a, b) => {
      let value = 0;

      if (sortKey === "title") {
        value = a.title.localeCompare(b.title);
      } else if (sortKey === "priority") {
        value = priorityRank[b.priority] - priorityRank[a.priority];
      } else {
        value =
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime();
      }

      return sortOrder === "asc" ? value : -value;
    });

    return list;
  }, [tasks, sortKey, sortOrder]);

  const start = Math.floor(scrollTop / ROW_HEIGHT);
  const visible = sortedTasks.slice(start, start + 12);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortOrder("asc");
  };

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          padding: "12px 10px",
          background: "#f9fafb",
          borderBottom: "1px solid #eee",
          fontWeight: 600,
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        {["title", "priority", "dueDate", "status"].map((col) => {
          const active = sortKey === col;

          return (
            <div
              key={col}
              onClick={() =>
                col !== "status" && handleSort(col as SortKey)
              }
              style={{
                cursor: col === "status" ? "default" : "pointer",
                textTransform: "capitalize",
                color: active ? "#4f46e5" : "#111",
              }}
            >
              {col}
              {active && (
                <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div
        style={{ height: 400, overflow: "auto" }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: tasks.length * ROW_HEIGHT }}>
          <div
            style={{
              transform: `translateY(${start * ROW_HEIGHT}px)`,
            }}
          >
            {visible.map((task: Task) => {
              const styles = getPriorityStyles(task.priority);
              const due = new Date(task.dueDate);
              return (
                <div
                  key={task.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    height: ROW_HEIGHT,
                    alignItems: "center",
                    padding: "0 10px",
                    borderBottom: "1px solid #eee",
                    background: "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div>{task.title}</div>

                  <div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: styles.bg,
                        color: styles.color,
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div>
                    {due.toLocaleDateString()}
                  </div>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTask(task.id, {
                        status: e.target.value as Status,
                      })
                    }
                    style={{
                      padding: "4px 6px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#fff",
                    }}
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}