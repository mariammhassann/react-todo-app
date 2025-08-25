import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Sun, Moon } from "lucide-react"; // 🌙 modern icons

function TodoList() {
  //  Load tasks from localStorage OR fallback to default tasks///importantttt
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, text: "Task Day 1", completed: false },
          { id: 2, text: "Task Day 2", completed: true },
          { id: 3, text: "Task Day 3", completed: false },
        ];
  });

  //   showCompleted from localStorage OR fallback to true///importantttt
  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem("showCompleted");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [newTask, setNewTask] = useState("");

  //  Dark mode localStorage///importantttt
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  //  Save tasks when they change///importantttt
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  //  Save darkMode when it changes///importantttt
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  //  Save showCompleted when it changes ///importantttt
  useEffect(() => {
    localStorage.setItem("showCompleted", JSON.stringify(showCompleted));
  }, [showCompleted]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleShowCompleted = () => setShowCompleted(!showCompleted);

  const toggleTaskCompleted = (id) =>
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTodo = { id: Date.now(), text: newTask, completed: false };
    setTodos([...todos, newTodo]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  const displayedTodos = showCompleted
    ? todos
    : todos.filter((todo) => !todo.completed);

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "0",
        margin: "0",
        fontFamily: "Segoe UI, sans-serif",
        display: "flex",
        flexDirection: "column",
        backgroundColor: darkMode ? "#1e1e1e" : "#f3f3f3",
        color: darkMode ? "#f5f5f5" : "#000",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          padding: "15px 20px",
          backgroundColor: darkMode ? "#333" : "#0078D7",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My To-Do App
        <button
          onClick={toggleDarkMode}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {darkMode ? (
            <Sun size={22} color="#FFD700" /> //  light mode 
          ) : (
            <Moon size={22} color="#f5f5f5" /> // dark mode 
          )}
        </button>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "35px",
          overflowY: "auto",
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            backgroundColor: darkMode ? "#555" : "#e1e1e1",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "10px",
            height: "12px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: darkMode ? "#00b4d8" : "#0078D7",
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <p
          style={{
            textAlign: "right",
            marginTop: "-10px",
            marginBottom: "15px",
            color: darkMode ? "#bbb" : "#555",
            fontSize: "12px",
          }}
        >
          {completedTasks} / {totalTasks} completed
        </p>

        {/* Input for new task */}
        <div style={{ display: "flex", marginBottom: "15px", width: "100%" }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px 0 0 8px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: darkMode ? "#2b2b2b" : "white",
              color: darkMode ? "#f5f5f5" : "#000",
            }}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            style={{
              padding: "10px 15px",
              border: "none",
              backgroundColor: darkMode ? "#00b4d8" : "#0078D7",
              color: "white",
              borderRadius: "0 8px 8px 0",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        {/* Show/Hide completed tasks */}
        <button
          onClick={toggleShowCompleted}
          style={{
            marginBottom: "15px",
            width: "100%",
            padding: "8px",
            backgroundColor: darkMode ? "#00b4d8" : "#0078D7",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
          }}
        >
          {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
        </button>

        {/* Drag and Drop List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                style={{ listStyle: "none", padding: 0, width: "100%" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {displayedTodos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: darkMode ? "#2b2b2b" : "white",
                          padding: "10px",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          boxShadow: darkMode
                            ? "0 2px 5px rgba(0,0,0,0.6)"
                            : "0 2px 5px rgba(0,0,0,0.05)",
                          width: "100%",
                          color: darkMode ? "#f5f5f5" : "#000",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTaskCompleted(todo.id)}
                          style={{
                            marginRight: "10px",
                            width: "18px",
                            height: "18px",
                          }}
                        />
                        <span
                          style={{
                            textDecoration: todo.completed
                              ? "line-through"
                              : "none",
                            color: todo.completed
                              ? darkMode
                                ? "#888"
                                : "#8e8d8dff"
                              : darkMode
                              ? "#f5f5f5"
                              : "#000",
                            flex: 1,
                          }}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => deleteTask(todo.id)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#d11a2a",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </div>
  );
}

export default TodoList;
