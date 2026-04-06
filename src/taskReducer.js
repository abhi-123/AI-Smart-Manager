export const initialState = {
  taskList: [],
  search: "",
  filterStatus: "All",
  subTasks: [],
};
export const taskReducer = (state, action) => {
  switch (action.type) {
    case "GET_ALL_TASKS": {
      return {
        ...state,
        taskList: action.payload,
      };
    }
    case "ADD_TASK": {
      const AlreadyExistTask = state.taskList.filter(
        (task) => task.title === action.payload.title,
      );
      if (AlreadyExistTask.length > 0) {
        alert("Task Already Exist!");
      }
      console.log(action.payload);
      return {
        ...state,
        taskList: [action.payload, ...state.taskList],
      };
    }
    case "TOGGLE_EDIT_TASK": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload === task._id
            ? { ...task, isEdit: !task.isEdit }
            : task,
        ),
      };
    }
    case "UPDATE_TASK": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload._id === task._id
            ? { ...action.payload, isEdit: !task.isEdit }
            : task,
        ),
      };
    }
    case "DELETE_TASK": {
      return {
        ...state,
        taskList: state.taskList.filter((task) => task._id !== action.payload),
      };
    }
    case "TOGGLE_STATUS": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload._id === task._id ? action.payload : task,
        ),
      };
    }
    case "GENERATE_SUBTASKS": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload.id === task._id
            ? { ...task, subTasks: action.payload.subTasks }
            : task,
        ),
      };
    }
    case "UPDATE_SUBTASK": {
      return {
        ...state,
        taskList: state.taskList.map((task) => {
          if (task._id !== action.payload.id) return task;
          const updatedSubTasks = task.subTasks.map((subTask) => {
            if (subTask._id !== action.payload.subId) return subTask;
            return {
              ...subTask,
              isChecked: !subTask.isChecked,
            };
          });
          const allChecked = updatedSubTasks.every((sub) => sub.isChecked);
          return {
            ...task,
            subTasks: updatedSubTasks,
            status: allChecked ? "Done" : "In-Progress",
          };
        }),
      };
    }
    case "CLEAR_SUBTASKS":
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          task._id === action.payload
            ? { ...task, subTasks: [], status: "Todo" }
            : task,
        ),
      };

    case "SET_SEARCH": {
      return {
        ...state,
        search: action.payload,
      };
    }
    case "SET_FILTER": {
      return {
        ...state,
        filterStatus: action.payload,
      };
    }
    default:
      return state;
  }
};
