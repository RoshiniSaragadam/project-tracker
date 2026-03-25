
import ReactDOM from "react-dom/client";
import App from "./App";
import { TaskProvider } from "./store/useTaskStore";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <TaskProvider>
      <App />
    </TaskProvider>
);