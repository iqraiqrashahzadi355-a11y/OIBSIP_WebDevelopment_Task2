import React, { useState, useEffect } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("Low");
  const [darkMode, setDarkMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Browser Notification for new task
  const notify = (taskTitle) => {
    if (Notification.permission === "granted") {
      new Notification("New Task Added!", { body: taskTitle });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleAddTask = () => {
    if (!title.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, title, details, priority } : t
        )
      );
      setEditId(null);
    } else {
      const newTask = { id: Date.now(), title, details, priority };
      setTasks([newTask, ...tasks]);
      notify(title); // Trigger notification
    }
    setTitle("");
    setDetails("");
    setPriority("Low");
  };

  const handleDelete = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const handleEdit = (task) => {
    setTitle(task.title);
    setDetails(task.details);
    setPriority(task.priority);
    setEditId(task.id);
  };

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.priority === filter);

  // Drag & Drop logic
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setTasks(items);
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <div className="container">
        <h1>To-Do PRO App</h1>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="task-input">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button onClick={handleAddTask}>
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        <div className="filter">
          <label>Filter by priority:</label>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                className="task-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        className={`task-card ${task.priority.toLowerCase()}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <h3>{task.title}</h3>
                          <p>{task.details}</p>
                          <span className="priority">{task.priority}</span>
                        </div>
                        <div>
                          <button onClick={() => handleEdit(task)}>✎</button>
                          <button onClick={() => handleDelete(task.id)}>✖</button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
