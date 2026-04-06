import { Toaster } from "react-hot-toast";
import React, { useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import Filters from "./components/Filters";
import TaskList from "./components/TaskList";

function TaskManagerUI() {
  const [taskList, setTaskList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const newTaskStatusObj = {
    Todo: "In-Progress",
    "In-Progress": "Done",
  };

  const addTask = (item) => {
    console.log(item, taskList);
    const AlreadyExistTask = taskList.filter((task) => task.title === item);
    if (AlreadyExistTask.length > 0) {
      alert("Task Already Exist!");
      return;
    }
    setTaskList((prev) => [
      ...prev,
      { id: Date.now(), title: item, status: "Todo", time: Date.now() },
    ]);
  };

  const toggleStatus = (id) => {
    setTaskList((prev) => {
      return prev.map((task) => {
        if (task.id !== id) return task;
        return {
          ...task,
          status: newTaskStatusObj[task.status] || task.status,
        };
      });
    });
  };

  const deleteTask = (id) => {
    setTaskList((prev) => prev.filter((task) => task.id !== id));
  };
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
      <div className="min-h-screen bg-gray-100 p-3 md:p-6 w-screen">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* HEADER */}
          <Header totalTask={taskList.length} />

          {/* ADD TASK */}
          <AddTask submitTask={(task) => addTask(task)} />

          {/* FILTERS */}
          <Filters
            filterTaskBySearch={setSearch}
            filterTaskByStatus={setFilterStatus}
            filterStatus={filterStatus}
          />

          {/* TASK LIST */}
          <TaskList
            taskList={taskList}
            onDelete={(id) => deleteTask(id)}
            search={search}
            onToggleStatus={(id) => toggleStatus(id)}
            filterStatus={filterStatus}
          />
        </div>
      </div>
    </>
  );
}

export default TaskManagerUI;
