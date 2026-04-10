// 🔁 Cycle Detection (DFS)
export const detectCycle = (tasks) => {
  const graph = new Map();

  tasks.forEach((task) => {
    graph.set(task._id.toString(), task.dependencies.map(d => d.toString()));
  });

  const visited = new Set();
  const stack = new Set();

  const dfs = (node) => {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (let neighbor of graph.get(node) || []) {
      if (dfs(neighbor)) return true;
    }

    stack.delete(node);
    return false;
  };

  for (let node of graph.keys()) {
    if (dfs(node)) return true;
  }

  return false;
};

export const getExecutionOrder = (tasks) => {
  const inDegree = {};
  const graph = {};

  tasks.forEach((task) => {
    inDegree[task._id] = 0;
    graph[task._id] = [];
  });

  tasks.forEach((task) => {
    task.dependencies.forEach((dep) => {
      graph[dep]?.push(task._id);
      inDegree[task._id]++;
    });
  });

  // initial queue
  let queue = tasks
    .filter((t) => inDegree[t._id] === 0)
    .sort(sortTasks);

  const result = [];

  while (queue.length) {
    const current = queue.shift();
    result.push(current);

    for (let neighbor of graph[current._id]) {
      inDegree[neighbor]--;

      if (inDegree[neighbor] === 0) {
        const task = tasks.find(t => t._id == neighbor);
        queue.push(task);
      }
    }

    queue.sort(sortTasks);
  }

  return result;
};

// Sorting rules
const sortTasks = (a, b) => {
  if (b.priority !== a.priority) return b.priority - a.priority;
  if (a.estimatedHours !== b.estimatedHours)
    return a.estimatedHours - b.estimatedHours;

  return new Date(a.createdAt) - new Date(b.createdAt);
};