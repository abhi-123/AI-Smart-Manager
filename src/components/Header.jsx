import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

function Header() {
  const { state } = useContext(TaskContext);
  return (
    <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          🧠 Smart Task Manager
        </h1>
        <p className="text-sm text-gray-500">Stay productive and organized</p>
      </div>
      <div className="text-sm text-gray-500">
        Total Tasks:{" "}
        <span className="font-semibold">{state.taskList.length}</span>
      </div>
    </div>
  );
}

export default Header;
