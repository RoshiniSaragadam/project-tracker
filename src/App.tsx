import { useEffect, useState } from "react";
import { generateTasks } from "./data/generateTasks";
import { useTasks } from "./store/useTaskStore";
import KanbanView from "./Components/Kanban";
import ListView from "./Components/List";
import TimelineView from "./Components/Timeline";
import "./App.css"

// import KanbanView from "./components/Kanban/KanbanView";
// import ListView from "./components/List/ListView";
// import TimelineView from "./components/Timeline/TimelineView";

type View = "kanban" | "list" | "timeline";

export default function App() {
  const { setTasks } = useTasks();
  const [view, setView] = useState<View>("kanban");

  useEffect(() => {
    setTasks(generateTasks(500));
  }, [setTasks]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Project Tracker</h2>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        {["kanban", "list", "timeline"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            style={{
              background: view === v ? "#4f46e5" : "#e5e7eb",
              color: view === v ? "#fff" : "#111",
              fontWeight: 500,
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "kanban" && <KanbanView />}
      {view === "list" && <ListView />}
      {view === "timeline" && <TimelineView />}
    </div>
  );
}