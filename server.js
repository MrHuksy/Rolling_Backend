const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Legacy-style callback-based API

server.get("/tasks", (req, res) => {
  const tasks = router.db.get("tasks").value();
  res.status(200).json(tasks);
});

server.get("/tasks/:id", (req, res) => {
  const task = router.db.get("tasks").find({ id: req.params.id }).value();
  if (task) {
    res.status(200).json(task);
  } else {
    res.sendStatus(404);
  }
});

server.post("/tasks", (req, res) => {
  const db = router.db;
  const newTask = req.body;
  if (!newTask || Object.keys(newTask).length === 0) {
    return res.status(400).json({ error: "task need to be required." });
  }
  const tasks = db.get("tasks");
  const id = Date.now().toString();
  const taskWithId = { id, ...newTask };
  tasks.push(taskWithId).write();
  res.status(201).json(taskWithId);
});

server.delete("/tasks/:id", (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const task = db.get("tasks").find({ id }).value();

  if (task) {
    db.get("tasks").remove({ id }).write();
    res.status(200).json({ message: "Task has been deleted." });
  } else {
    res.sendStatus(404);
  }
});

server.patch("/tasks/:id", (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const task = db.get("tasks").find({ id }).value();

  if (task) {
    const updated = { ...task, ...req.body };
    db.get("tasks").find({ id }).assign(updated).write();
    res.status(200).json(updated);
  } else {
    res.sendStatus(404);
  }
});

server.use(router);

server.listen(3001, () => {
  console.log("Mock API running at http://localhost:3001");
});
