import { useState, useContext } from "react";
import { TaskContext } from "./TaskContext";

function AddTask() {
  const { dispatch } = useContext(TaskContext);
  const [task, setTask] = useState("");

  const submitTask = (task) => {
    dispatch({ type: "ADD_TASK", payload: task });
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow flex gap-3 flex-col md:flex-row">
      <input
        type="text"
        placeholder="Enter a new task..."
        className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = task.trim();
            if (!value) return;
            setTask("");
            submitTask(value);
          }
        }}
      />
      <button
        className={`px-5 py-2 rounded-xl transition
            ${
              task.trim()
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        onClick={() => {
          const value = task.trim();
          if (!value) return;
          setTask("");
          submitTask(value);
        }}
        disabled={!task.trim()}
      >
        Add Task
      </button>
    </div>
  );
}

export default AddTask;
