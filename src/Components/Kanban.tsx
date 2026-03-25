import { useMemo, useState } from "react";
import type { Task, Status } from "../types";
import { useTasks } from "../store/useTaskStore";
import { usePresence } from "../hooks/usePresence";

const columns: Status[] = ["todo", "inprogress", "review", "done"];

const columnTitles: Record<Status, string> = {
    todo: "To Do",
    inprogress: "In Progress",
    review: "In Review",
    done: "Done",
};

type GroupedTasks = {
    [key in Status]: Task[];
};

export default function KanbanView() {
    const { tasks, updateTask } = useTasks();

    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<Status | null>(null);

    const users = usePresence(tasks.map((t) => t.id));

    // Group tasks
    const data = useMemo<GroupedTasks>(() => {
        const grouped: GroupedTasks = {
            todo: [],
            inprogress: [],
            review: [],
            done: [],
        };

        for (let i = 0; i < tasks.length; i++) {
            const task: Task = tasks[i];
            grouped[task.status].push(task);
        }

        return grouped;
    }, [tasks]);

    const createPreview = (title: string) => {
        const el = document.createElement("div");
        el.className = "drag-preview";
        el.innerText = title;
        return el;
    };

    // Drag start
    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task
    ) => {
        setDraggedId(task.id);
        e.dataTransfer.setData("taskId", task.id);

        // custom preview
        const preview = createPreview(task.title);
        preview.style.padding = "10px";
        preview.style.background = "#fff";
        preview.style.borderRadius = "6px";
        preview.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        preview.style.opacity = "0.9";
        preview.innerText = task.title;

        document.body.appendChild(preview);
        e.dataTransfer.setDragImage(preview, 20, 20);

        setTimeout(() => {
            document.body.removeChild(preview);
        }, 0);
    };

    // Drop
    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        status: Status
    ) => {
        const id = e.dataTransfer.getData("taskId");
        updateTask(id, { status });
        setDraggedId(null);
        setDragOverCol(null);
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const today = new Date();

        const diff = Math.floor(
            (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff === 0) return "Due Today";
        if (diff > 7) return `${diff} days overdue`;

        return d.toLocaleDateString();
    };

    const userMap = useMemo(() => {
        const map: Record<string, typeof users> = {};

        for (let i = 0; i < users.length; i++) {
            const u = users[i];
            if (!u.taskId) continue;

            if (!map[u.taskId]) map[u.taskId] = [];
            map[u.taskId].push(u);
        }

        return map;
    }, [users]);

    return (
        <div style={{ display: "flex", gap: 16, padding: 10 }}>
            {columns.map((col) => (
                <div
                    key={col}
                    style={{
                        width: "25%",
                        borderRadius: 10,
                        background: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: "12px 10px",
                            borderBottom: "1px solid #eee",
                            fontWeight: 600,
                            fontSize: 14,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>{columnTitles[col]}</span>
                        <span style={{ color: "#667085" }}>
                            {data[col].length}
                        </span>
                    </div>

                    {/* Column */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverCol(col);
                        }}
                        onDragLeave={() => setDragOverCol(null)}
                        onDrop={(e) => handleDrop(e, col)}
                        style={{
                            padding: 10,
                            maxHeight: 450,
                            overflowY: "auto",
                            background:
                                dragOverCol === col ? "#e6f7ff" : "transparent",
                            transition: "background 0.2s",
                        }}
                    >
                        {data[col].slice(0, 50).map((task) => {
                            const isDragging = draggedId === task.id;
                            // const activeUsers = users.filter(
                            //     (u) => u.taskId === task.id
                            // );
                            const activeUsers = userMap[task.id] || [];

                            return (
                                <div key={task.id}>
                                    {/* Placeholder */}
                                    {isDragging && (
                                        <div
                                            style={{
                                                height: 80,
                                                marginBottom: 12,
                                                borderRadius: 8,
                                                background: "#f1f5f9",
                                                border: "2px dashed #c7d2fe",
                                            }}
                                        />
                                    )}

                                    {/* Card */}
                                    {!isDragging && (
                                        <div
                                            draggable
                                            onDragStart={(e) =>
                                                handleDragStart(e, task)
                                            }
                                            style={{
                                                background: "#fff",
                                                padding: 12,
                                                marginBottom: 12,
                                                borderRadius: 8,
                                                boxShadow:
                                                    "0 2px 6px rgba(0,0,0,0.08)",
                                                cursor: "grab",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            {/* Title */}
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                    marginBottom: 8,
                                                }}
                                            >
                                                {task.title}
                                            </div>

                                            {/* Row */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                {/* Avatar */}
                                                <div
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: "50%",
                                                        background: "#4f46e5",
                                                        color: "#fff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {task.assignee}
                                                </div>

                                                {/* Priority */}
                                                <span
                                                    style={{
                                                        padding: "3px 8px",
                                                        borderRadius: 999,
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        textTransform: "capitalize",
                                                        background:
                                                            task.priority === "critical"
                                                                ? "#fee2e2"
                                                                : task.priority === "high"
                                                                    ? "#fef3c7"
                                                                    : task.priority === "medium"
                                                                        ? "#e0e7ff"
                                                                        : "#f3f4f6",
                                                        color:
                                                            task.priority === "critical"
                                                                ? "#b91c1c"
                                                                : task.priority === "high"
                                                                    ? "#92400e"
                                                                    : task.priority === "medium"
                                                                        ? "#3730a3"
                                                                        : "#374151",
                                                    }}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            {/* Due Date */}
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color:
                                                        new Date(task.dueDate) < new Date()
                                                            ? "#dc2626"
                                                            : "#6b7280",
                                                }}
                                            >
                                                {formatDate(task.dueDate)}
                                            </div>

                                            {/* Presence Avatars */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    marginTop: 8,
                                                    alignItems: "center",
                                                }}
                                            >
                                                {activeUsers.slice(0, 2).map((user) => (
                                                    <div
                                                        key={user.id}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: "50%",
                                                            background: user.color,
                                                            border: "2px solid white",
                                                            marginRight: -6,
                                                        }}
                                                    />
                                                ))}

                                                {activeUsers.length > 2 && (
                                                    <div
                                                        style={{
                                                            fontSize: 10,
                                                            marginLeft: 6,
                                                            color: "#555",
                                                        }}
                                                    >
                                                        +{activeUsers.length - 2}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}