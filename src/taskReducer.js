export const initialState = {
  taskList: [],
  search: "",
  filterStatus: "All",
  subTasks: [],
};
export const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK": {
      const AlreadyExistTask = state.taskList.filter(
        (task) => task.title === action.payload,
      );
      if (AlreadyExistTask.length > 0) {
        alert("Task Already Exist!");
      }
      return {
        ...state,
        taskList: [
          {
            id: Date.now(),
            title: action.payload,
            status: "Todo",
            time: Date.now(),
          },
          ...state.taskList,
        ],
      };
    }
    case "TOGGLE_EDIT_TASK": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload === task.id ? { ...task, isEdit: !task.isEdit } : task,
        ),
      };
    }
    case "UPDATE_TASK": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload.id === task.id
            ? { ...task, title: action.payload.newTitle, isEdit: !task.isEdit }
            : task,
        ),
      };
    }
    case "DELETE_TASK": {
      return {
        ...state,
        taskList: state.taskList.filter((task) => task.id !== action.payload),
      };
    }
    case "TOGGLE_STATUS": {
      const newTaskStatusObj = {
        Todo: "In-Progress",
        "In-Progress": "Done",
      };
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload === task.id
            ? { ...task, status: newTaskStatusObj[task.status] || task.status }
            : task,
        ),
      };
    }
    case "GENERATE_SUBTASKS": {
      return {
        ...state,
        taskList: state.taskList.map((task) =>
          action.payload.id === task.id
            ? { ...task, subTasks: action.payload.subTasks }
            : task,
        ),
      };
    }
    case "UPDATE_SUBTASK": {
      return {
        ...state,
        taskList: state.taskList.map((task) => {
          if (task.id !== action.payload.id) return task;
          const updatedSubTasks = task.subTasks.map((subTask) => {
            if (subTask.title !== action.payload.subTitle) return subTask;
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
          task.id === action.payload
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
