const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database("./tasks.db");

db.run(
  `CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed BOOLEAN DEFAULT FALSE)`,
);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (error, rows) => {
    if (error) {
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });
});
app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM tasks WHERE id = ?", [id], (error, row) => {
    if (error) {
      return res.status(500).json({ error: "DB error" });
    }
    if (!row) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(row);
  });
});

app.post("/tasks", (req, res) => {
  const title = req.body.title;
  const completed = req.body.completed;

  db.run(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed],
    (error) => {
      if (error) {
        console.log(error.code);
        return res.status(500).json({ error: "DB error" });
      }
    },
  );

  res.status(201).json({ message: "Task created" });
});
app.put("/tasks/:id", (req, res) => {
  const completed = req.body.completed;
  const id = req.params.id;
  const title = req.body.title;

  db.run(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
    [title, completed, id],
    (error) => {
      if (error) {
        console.log(error.code);
        return res.status(500).json({ error: "DB error" });
      }
    },
  );
  res.status(201).json({ message: "Task updated" });
});
app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM tasks WHERE id = ?", [id], (error) => {
    if (error) {
      console.log(error.code);
      return res.status(500).json({ error: "DB error" });
    }
    res.status(200).json({ message: "Task deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
