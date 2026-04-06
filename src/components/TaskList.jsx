import { useContext, useEffect, useState, useRef } from "react";
import { TaskContext } from "../context/TaskContext";
import toast from "react-hot-toast";
import {
  deleteTask,
  editTask,
  generateSubTasks,
  getTasks,
  toggleStatus,
  toggleSubTaskData,
} from "../api/api";

function TaskList() {
  const [openTaskId, setOpenTaskId] = useState(null);
  const [editedText, setEditedText] = useState({});
  const [subTaskLoading, setSubTaskLoading] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const toggleMapRef = useRef({});
  const { state, dispatch } = useContext(TaskContext);

  let filteredData = state.taskList;

  useEffect(() => {
    const getTasksData = async () => {
      try {
        const data = await getTasks();
        console.log(data, "response");
        if (data.success)
          dispatch({ type: "GET_ALL_TASKS", payload: data.tasks });
      } catch (error) {
        toast.custom(
          () => (
            <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">⚠️</span>
                <div>
                  <p className="font-medium">Failed to get tasks</p>
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
    getTasksData();
  }, []);

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

  console.log(state.taskList);

  const getRelativeTime = (date) => {
    console.log(date);
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return "yesterday";
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const handleToggleStatus = async (id) => {
    try {
      const data = await toggleStatus(id);
      console.log(data, "response");
      if (data.success)
        dispatch({
          type: "TOGGLE_STATUS",
          payload: data.task,
        });
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

  const taskColor = {
    Todo: "bg-purple-100 text-purple-600",
    "In-Progress": "bg-yellow-100 text-yellow-600",
    Done: "bg-green-100 text-green-600",
  };

  const handleEdit = async (task) => {
    try {
      const data = await editTask(task._id, editedText[task._id]);
      console.log(data, "response");
      if (data.success) {
        //  const updatedValue = editedText[task._id];
        dispatch({
          type: "UPDATE_TASK",
          payload: data.task,
        });
        setEditedText((prev) => {
          const { [task._id]: _, ...rest } = prev;
          return rest;
        });
      }
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

    console.log(editedText);
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteTask(id);
      console.log(data, "response");
      if (data.success) {
        toast.custom(
          () => (
            <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
              <div className="flex items-start gap-3">
                {/* <span className="text-green-400 text-lg">✔️</span> */}
                <div>
                  <p className="font-medium">Task deleted</p>
                  <p className="text-sm text-gray-400">
                    Your task has been removed successfully.
                  </p>
                </div>
              </div>
            </div>
          ),
          {
            duration: 2000,
          },
        );
        dispatch({
          type: "DELETE_TASK",
          payload: id,
        });
        setSubTaskLoading((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
        setEditedText((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (error) {
      toast.custom(
        () => (
          <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to delete task</p>
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

  const handleSubTasks = async (task) => {
    try {
      setSubTaskLoading((prev) => ({ ...prev, [task._id]: true }));
      const res = await generateSubTasks(task._id, task.title);
      console.log(res, "response");
      if (res.success && res.task && res.task.subTasks.length > 0) {
        dispatch({
          type: "GENERATE_SUBTASKS",
          payload: {
            id: task._id,
            subTasks: res.task.subTasks,
          },
        });
        setOpenTaskId(task._id);
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
      setSubTaskLoading((prev) => ({ ...prev, [task._id]: false }));
    } finally {
      setSubTaskLoading((prev) => ({ ...prev, [task._id]: false }));
    }
  };

  const toggleSubTask = async (taskID, subtaskID) => {
    if (toggleMapRef.current[subtaskID]) return;
    toggleMapRef.current[subtaskID] = true;
    try {
      dispatch({
        type: "UPDATE_SUBTASK",
        payload: {
          id: taskID,
          subId: subtaskID,
        },
      });

      const res = await toggleSubTaskData(taskID, subtaskID);
      console.log(res, "response");
      if (res.success) {
        toggleMapRef.current[subtaskID] = false;
      }
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: "UPDATE_SUBTASK",
          payload: {
            id: taskID,
            subId: subtaskID,
          },
        });
        toggleMapRef.current[subtaskID] = false;
      }, 500);

      toast.custom(
        () => (
          <div className="bg-[#1f1f1f] text-white px-5 py-4 rounded-2xl shadow-xl border border-white/10 w-[340px]">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="font-medium">Failed to update subtask</p>
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
    <div className="space-y-4">
      {filteredData?.length > 0 ? (
        filteredData.map((task) => {
          const isInProgress = task.status === "In-Progress";
          const isDone = task.status === "Done";
          const hasSubTasks = task.subTasks?.length > 0;
          const isOpen = openTaskId === task._id;

          return (
            <div
              key={task._id}
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
                    setOpenTaskId(isOpen ? null : task._id);
                  }}
                >
                  {task.isEdit ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={editedText[task._id] ?? ""}
                        className="flex-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
                        onChange={(e) => {
                          setEditedText((prev) => ({
                            ...prev,
                            [task._id]: e.target.value,
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEdit(task);
                          }
                        }}
                      />

                      <button
                        className={`text-green-600 text-sm hover:scale-110 transition ${!editedText[task._id]?.trim() ? "cursor-not-allowed disabled:opacity-50" : "cursor-pointer"}`}
                        disabled={!editedText[task._id]?.trim()}
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
                            payload: task._id,
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
                                  [task._id]: task.title,
                                }));

                                dispatch({
                                  type: "TOGGLE_EDIT_TASK",
                                  payload: task._id,
                                });
                              }}
                            >
                              ✏️
                            </button>
                          )}

                          {hasSubTasks && (
                            <span className="text-purple-500 text-sm cursor-pointer">
                              {isOpen ? "▲" : "▼"}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        {getRelativeTime(task.createdAt)}
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
                      disabled={hasSubTasks || subTaskLoading?.[task._id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubTasks(task);
                      }}
                      className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1
                  ${
                    hasSubTasks
                      ? "bg-gray-200 text-gray-400"
                      : subTaskLoading[task._id]
                        ? "bg-purple-300 text-white"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  }`}
                    >
                      {subTaskLoading[task._id]
                        ? "⏳ Generating"
                        : "✨ AI Subtasks"}
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
                      handleToggleStatus(task._id);
                      dispatch({
                        type: "TOGGLE_STATUS",
                        payload: task._id,
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
                      handleDelete(task._id);
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>

              {/* 🔥 SUBTASK SECTION */}
              {isOpen && hasSubTasks && (
                <div className="bg-gray-50 px-5 pb-5 space-y-3 border-t pt-3 mt-3">
                  <div className="flex justify-between gap-2 items-center">
                    <p className=" font-medium text-gray-800">Subtasks</p>

                    {task.status === "Todo" && (
                      <span className="text-xs text-gray-400">
                        Switch to In-Progress to enable
                      </span>
                    )}
                  </div>

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
                          onChange={() => {
                            toggleSubTask(task._id, sub._id);
                          }}
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
                    payload: selectedTask._id,
                  });
                  setSubTaskLoading((prev) => {
                    const { [selectedTask._id]: _, ...rest } = prev;
                    return rest;
                  });

                  // enable edit
                  dispatch({
                    type: "TOGGLE_EDIT_TASK",
                    payload: selectedTask._id,
                  });

                  setEditedText((prev) => ({
                    ...prev,
                    [selectedTask._id]: selectedTask.title,
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
