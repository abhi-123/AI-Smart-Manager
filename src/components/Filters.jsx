import React, { useContext } from "react";
import { TaskContext } from "./TaskContext";

function Filters() {
  const { state, dispatch } = useContext(TaskContext);
  // console.log(state.filterStatus);
  return (
    <div className=" flex flex-col md:flex-row gap-8 justify-between w-full">
      <div className="flex gap-3">
        {["All", "Todo", "In-Progress", "Done"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-lg text-sm transition shadow cursor-pointer ${
              filter === state.filterStatus
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 hover:bg-purple-50"
            }`}
            onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
          >
            {filter}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Filter by Task Name..."
        className="p-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400 w-full  md:w-2xs"
        // value={task}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH", payload: e.target.value })
        }
      />
    </div>
  );
}

export default Filters;
