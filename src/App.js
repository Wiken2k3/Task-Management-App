import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo-list");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdate = () => {
    if (!input.trim()) return;

    if (editingId) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? { ...task, text: input, deadline, difficulty }
          : task
      ));
      toast.info("✏️ Task updated");
    } else {
      const newTask = {
        id: Date.now(),
        text: input,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        deadline,
        difficulty,
      };
      setTasks([newTask, ...tasks]);
      gsap.from(".task-card", { opacity: 0, y: -20, duration: 0.4 });
      toast.success("✅ Task added!");
    }

    setInput("");
    setDeadline("");
    setDifficulty("medium");
    setEditingId(null);
  };

  const handleComplete = (id) => {
    const now = new Date();
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const completedAt = now.toISOString();
        const status = new Date(task.deadline) >= now ? "On time" : "Late";
        toast.success(`✅ Marked complete (${status})`);
        return { ...task, completed: true, completedAt };
      }
      return task;
    }));
  };

  const handleDelete = (id) => {
    toast.warn("🗑️ Task deleted");
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setInput(task.text);
    setDeadline(task.deadline);
    setDifficulty(task.difficulty);
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const sortedTasks = [...tasks].sort((a, b) => {
    const aTime = new Date(a.deadline).getTime();
    const bTime = new Date(b.deadline).getTime();
    return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
  });

  const filteredTasks = sortedTasks
    .filter(t => (filter === "all" ? true : t.difficulty === filter))
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()));

  const todoTasks = filteredTasks.filter(t => !t.completed);
  const doneTasks = filteredTasks.filter(t => t.completed);

  return (
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <ToastContainer />
        <div className="top-bar">
          <h1>📋 Task Management App</h1>
          <button onClick={toggleDarkMode}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="stats">
          <p>Total: {tasks.length}</p>
          <p>To do: {todoTasks.length}</p>
          <p>Completed: {doneTasks.length}</p>
        </div>

        <div className="form">
          <input
            type="text"
            placeholder="Enter task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={handleAddOrUpdate}>
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Mới nhất</option>
            <option value="desc">Lâu nhất</option>
          </select>
        </div>

        <div className="columns">
          <div>
            <h3>🕓 To Do</h3>
            {todoTasks.map(task => (
              <div key={task.id} className="task-card">
                <h4>{task.text}</h4>
                <p>Due: {task.deadline}</p>
                <p>Level: {task.difficulty}</p>
                <div className="btns">
                  <button onClick={() => handleComplete(task.id)}>✔</button>
                  <button onClick={() => handleEdit(task)}>✏</button>
                  <button onClick={() => handleDelete(task.id)}>❌</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3>✅ Completed</h3>
            {doneTasks.map(task => (
              <div key={task.id} className="task-card done">
                <h4>{task.text}</h4>
                <p>Done: {new Date(task.completedAt).toLocaleString()}</p>
                <p>{new Date(task.completedAt) <= new Date(task.deadline) ? "⏱️ On time" : "⚠️ Late"}</p>
                <p>Level: {task.difficulty}</p>
                <button onClick={() => handleDelete(task.id)}>❌</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
}

export default App;
