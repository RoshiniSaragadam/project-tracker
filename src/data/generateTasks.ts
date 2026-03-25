import type { Task, Status, Priority } from "../types";

const users = ["AB", "RK", "MS", "JD", "KL", "VP"];
const statuses: Status[] = ["todo", "inprogress", "review", "done"];
const priorities: Priority[] = ["low", "medium", "high", "critical"];

export function generateTasks(count: number = 500): Task[] {
    return Array.from({ length: count }, (_, i) => {
        const start = new Date();
        start.setDate(start.getDate() - Math.floor(Math.random() * 10));

        const due = new Date();
        due.setDate(due.getDate() + Math.floor(Math.random() * 10));

        return {
            id: String(i),
            title: `Task ${i + 1}`,
            assignee: users[Math.floor(Math.random() * users.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            startDate: Math.random() > 0.2 ? start.toISOString() : null,
            dueDate: due.toISOString(),
        };
    });
}