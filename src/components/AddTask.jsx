import { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import toast from "react-hot-toast";
import { addTask } from "../api/api";

function AddTask() {
  const { dispatch } = useContext(TaskContext);

  const [task, setTask] = useState("");

  const submitTask = async (task) => {
    try {
      const data = await addTask(task);
      console.log(data, "response");
      if (data.task) dispatch({ type: "ADD_TASK", payload: data.task });
    } catch (error) {
      toast.custom(
        () => (
          <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to add task</p>
                <p className="text-sm text-gray-400">
                  Please check your connection and try again.
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: 3000,
        },
      );
      console.log(error);
    }
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
