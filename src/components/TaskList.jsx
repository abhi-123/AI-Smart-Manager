import { useContext, useState } from "react";
import { TaskContext } from "./TaskContext";
import toast from "react-hot-toast";
import { generateSubTasks } from "../api/api";

function TaskList() {
  const [openTaskId, setOpenTaskId] = useState(null);
  const [editedText, setEditedText] = useState({});
  const [subTaskLoading, setSubTaskLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { state, dispatch } = useContext(TaskContext);

  let filteredData = state.taskList;

  if (state.search) {
    filteredData = state.taskList.filter((task) =>
      task.title.toLowerCase().includes(state.search.toLowerCase()),
    );
  }

  if (state.filterStatus && state.filterStatus !== "All") {
    filteredData = filteredData.filter(
      (task) => task.status.toLowerCase() === state.filterStatus.toLowerCase(),
    );
  }

  const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return "yesterday";
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const taskColor = {
    Todo: "bg-purple-100 text-purple-600",
    "In-Progress": "bg-yellow-100 text-yellow-600",
    Done: "bg-green-100 text-green-600",
  };

  const handleEdit = (task) => {
    console.log(editedText);
    const updatedValue = editedText[task.id];
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: task.id,
        newTitle: updatedValue,
      },
    });
    setEditedText((prev) => {
      const { [task.id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubTasks = async (task) => {
    try {
      setSubTaskLoading(true);
      const res = await generateSubTasks(task.title);
      console.log(res, "response");
      if (res.success && res.data) {
        dispatch({
          type: "GENERATE_SUBTASKS",
          payload: {
            id: task.id,
            subTasks: res.data.subTasks,
          },
        });
        setOpenTaskId(task.id);
      }
    } catch (error) {
      toast.custom(
        () => (
          <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to generate subtasks</p>
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
      setSubTaskLoading(false);
    } finally {
      setSubTaskLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {filteredData?.length > 0 ? (
        filteredData.map((task) => {
          const isInProgress = task.status === "In-Progress";
          const isDone = task.status === "Done";
          const hasSubTasks = task.subTasks?.length > 0;
          const isOpen = openTaskId === task.id;

          return (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow overflow-hidden hover:bg-gray-50 transition hover:shadow-md hover:-translate-y-[1px]"
            >
              {/* 🔹 MAIN TASK */}
              <div className="p-5 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                {/* 🔹 LEFT SECTION */}
                <div
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.isEdit) return;
                    if (!hasSubTasks) return; // 🔥 FIX
                    setOpenTaskId(isOpen ? null : task.id);
                  }}
                >
                  {task.isEdit ? (
                    <div className="flex items-start gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={editedText[task.id] ?? ""}
                        className="flex-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
                        onChange={(e) => {
                          setEditedText((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEdit(task);
                          }
                        }}
                      />

                      <button
                        className={`text-green-600 text-sm hover:scale-110 transition ${!editedText[task.id]?.trim() ? "cursor-not-allowed disabled:opacity-50" : "cursor-pointer"}`}
                        disabled={!editedText[task.id]?.trim()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task);
                        }}
                      >
                        ✔
                      </button>

                      <button
                        className="text-red-500 text-sm hover:scale-110 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "TOGGLE_EDIT_TASK",
                            payload: task.id,
                          });
                        }}
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 justify-between md:justify-start">
                        <p className="text-gray-800 font-medium break-words leading-relaxed">
                          {task.title}
                        </p>
                        <div className="flex gap-2">
                          {!isDone && (
                            <button
                              className="text-gray-400 hover:text-purple-600 transition cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();

                                if (hasSubTasks) {
                                  setSelectedTask(task);
                                  setShowWarning(true);
                                  return;
                                }

                                setEditedText((prev) => ({
                                  ...prev,
                                  [task.id]: task.title,
                                }));

                                dispatch({
                                  type: "TOGGLE_EDIT_TASK",
                                  payload: task.id,
                                });
                              }}
                            >
                              ✏️
                            </button>
                          )}

                          {hasSubTasks && (
                            <span className="text-purple-500 text-sm">
                              {isOpen ? "▲" : "▼"}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        {getRelativeTime(task.time)}
                      </p>
                    </>
                  )}
                </div>

                {/* 🔹 RIGHT SECTION */}
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${taskColor[task.status]}`}
                  >
                    {task.status}
                  </span>

                  {/* AI BUTTON */}
                  {!isDone && (
                    <button
                      disabled={hasSubTasks || subTaskLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubTasks(task);
                      }}
                      className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1
                  ${
                    hasSubTasks
                      ? "bg-gray-200 text-gray-400"
                      : subTaskLoading
                        ? "bg-purple-300 text-white"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  }`}
                    >
                      {subTaskLoading ? "⏳ Generating" : "✨ AI Subtasks"}
                    </button>
                  )}

                  {/* ACTIONS */}
                  <button
                    title="Toggle Status"
                    className={`p-1.5 rounded-full transition
  ${
    isDone
      ? "text-gray-300 cursor-not-allowed"
      : "text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
  }`}
                    disabled={isDone}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({
                        type: "TOGGLE_STATUS",
                        payload: task.id,
                      });
                    }}
                  >
                    🔁
                  </button>

                  <button
                    title="Delete Task"
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({
                        type: "DELETE_TASK",
                        payload: task.id,
                      });
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>

              {/* 🔥 SUBTASK SECTION */}
              {isOpen && hasSubTasks && (
                <div className="bg-gray-50 px-5 pb-5 space-y-3 border-t pt-3 mt-3">
                  <p className="text-sm font-medium text-gray-700">Subtasks</p>

                  {task.status === "Todo" && (
                    <span className="text-xs text-gray-400">
                      Switch to In-Progress to enable
                    </span>
                  )}

                  <div className="space-y-2">
                    {task.subTasks.map((sub, index) => (
                      <label
                        key={index}
                        className={`flex items-center gap-2 text-sm ${
                          isInProgress
                            ? "text-gray-700"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={!isInProgress}
                          checked={sub.isChecked}
                          onChange={() =>
                            dispatch({
                              type: "UPDATE_SUBTASK",
                              payload: {
                                id: task.id,
                                subTitle: sub.title,
                              },
                            })
                          }
                        />

                        <span
                          className={`${sub.isChecked ? "line-through opacity-70" : ""}`}
                        >
                          {sub.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
          {state.search ? (
            <>
              😕 No task found <br />
              <span className="text-sm">
                Try again with a different search term or try switching filter
              </span>
            </>
          ) : state.filterStatus === "All" ? (
            <>
              🚀 No tasks yet <br />
              <span className="text-sm">
                Add your first task to get started
              </span>
            </>
          ) : (
            <>
              {`😕 No tasks in  ${state.filterStatus}`}
              <br />
              <span className="text-sm">
                Try switching filter or add a new task
              </span>
            </>
          )}
        </div>
      )}
      {showWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[320px] shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">⚠️ Warning</h2>

            <p className="text-sm text-gray-500 mt-2">
              If you edit this task, all subtasks will be cleared and the task
              status will reset to{" "}
              <span className="font-medium text-gray-700">"Todo"</span>.
            </p>

            <div className="flex justify-end gap-3 mt-5">
              {/* CANCEL */}
              <button
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  setShowWarning(false);
                  setSelectedTask(null);
                }}
              >
                Cancel
              </button>

              {/* CONTINUE */}
              <button
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  // clear subtasks
                  dispatch({
                    type: "CLEAR_SUBTASKS",
                    payload: selectedTask.id,
                  });

                  // enable edit
                  dispatch({
                    type: "TOGGLE_EDIT_TASK",
                    payload: selectedTask.id,
                  });

                  setEditedText((prev) => ({
                    ...prev,
                    [selectedTask.id]: selectedTask.title,
                  }));

                  setShowWarning(false);
                  setSelectedTask(null);
                  setOpenTaskId(null);
                }}
              >
                Continue & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
