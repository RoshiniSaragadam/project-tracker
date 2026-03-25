const users = ["AB", "RK", "MS", "JD", "KL", "VP"];
const statuses = ["todo", "inprogress", "review", "done"];
const priorities = ["low", "medium", "high", "critical"];

export function generateTasks(count = 500) {
  return Array.from({ length: count }, (_, i) => {
    const start = new Date();
    start.setDate(start.getDate() - Math.floor(Math.random() * 10));

    const due = new Date();
    due.setDate(due.getDate() + Math.floor(Math.random() * 10));

    return {
      id: String(i),
      title: `Task ${i + 1}`,
      assignee: users[Math.floor(Math.random() * users.length)],
      status: statuses[Math.floor(Math.random() * 4)],
      priority: priorities[Math.floor(Math.random() * 4)],
      startDate: Math.random() > 0.2 ? start.toISOString() : null,
      dueDate: due.toISOString(),
    };
  });
}