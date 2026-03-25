import { useTasks } from "../store/useTaskStore";
import type { Task } from "../types";

const DAY_WIDTH = 30;

function getPriorityColor(priority: string) {
  if (priority === "critical") return "#ef4444";
  if (priority === "high") return "#f59e0b";
  if (priority === "medium") return "#6366f1";
  return "#9ca3af";
}

export default function TimelineView() {
  const { tasks } = useTasks();

  const today = new Date();

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  const totalDays = endOfMonth.getDate();
  const timelineWidth = totalDays * DAY_WIDTH;

  const todayOffset = (today.getDate() - 1) * DAY_WIDTH;

  return (
    <div style={{ overflowX: "auto", padding: 12 }}>
      <div
        style={{
          width: timelineWidth + 180,
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", marginBottom: 12 }}>
          <div style={{ width: 150 }}></div>

          {Array.from({ length: totalDays }).map((_, i) => (
            <div
              key={i}
              style={{
                width: DAY_WIDTH,
                textAlign: "center",
                fontSize: 11,
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 150,
            right: 0,
            bottom: 0,
            display: "flex",
          }}
        >
          {Array.from({ length: totalDays }).map((_, i) => (
            <div
              key={i}
              style={{
                width: DAY_WIDTH,
                borderRight: "1px solid #eee",
              }}
            />
          ))}
        </div>

        {/* Today Line */}
        <div
          style={{
            position: "absolute",
            left: 150 + todayOffset,
            top: 0,
            bottom: 0,
            width: 2,
            background: "red",
            zIndex: 2,
          }}
        />

        {/* Tasks */}
        {tasks.slice(0, 50).map((task: Task) => {
          const start = task.startDate
            ? new Date(task.startDate)
            : new Date(task.dueDate);

          const end = new Date(task.dueDate);

          const startDay = Math.max(0, start.getDate() - 1);
          const endDay = Math.max(startDay, end.getDate() - 1);

          const left = startDay * DAY_WIDTH;
          const width = (endDay - startDay + 1) * DAY_WIDTH;

          return (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 14,
                position: "relative",
              }}
            >
              {/* Task Name */}
              <div
                style={{
                  width: 150,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {task.title}
              </div>

              {/* Row Track */}
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  height: 20,
                  background: "#f3f4f6",
                  borderRadius: 4,
                }}
              >
                {/* Task Bar */}
                <div
                  title={`${task.title} | ${new Date(
                    task.startDate || task.dueDate
                  ).toLocaleDateString()
                    } - ${new Date(task.dueDate).toLocaleDateString()}`}
                  style={{
                    position: "absolute",
                    left,
                    width,
                    height: 14,
                    top: 3,
                    borderRadius: 6,
                    background: getPriorityColor(task.priority),
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}