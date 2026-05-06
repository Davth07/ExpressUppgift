const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000;
app.use(express.json());

const db = new sqlite3.Database("./tasks.db");
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT, completed BOOLEAN DEFAULT FALSE)`,
);

app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (error, rows) => {
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const completed = req.body.completed;
  db.run(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
    [title, description, completed],
    (error) => {
      if (error) {
        return res.status(500).json({ message: "DB error" });
      }
      res.status(201).json({ message: "Task created" });
    },
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
