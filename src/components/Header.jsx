import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Header() {
  const navigate = useNavigate();
  const { state } = useContext(TaskContext);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");

    toast.success("Logged out successfully 👋");
  };
  return (
    <div className="bg-white p-2 md:p-6 rounded-2xl shadow flex justify-between items-center">
      <div>
        <h1 className="md:text-2xl text-xl font-bold text-gray-800">
          Smart Task Manager
        </h1>
        <p className="text-sm text-gray-500">Stay productive and organized</p>
      </div>
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>
          Total Tasks:{" "}
          <span className="font-semibold">{state.taskList.length}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-red-500 font-medium  px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
