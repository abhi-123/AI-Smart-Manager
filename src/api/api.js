//const baseURl = "https://ai-smart-manager.onrender.com";
const baseURl = "http://127.0.0.1:8000";
export const getTasks = async () => {
  const res = await fetch(baseURl + "/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const addTask = async (task) => {
  console.log(task, "taskkkkk");
  const res = await fetch(baseURl + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title: task,
    }),
  });
  const data = await res.json();
  return data;
};

export const toggleStatus = async (id) => {
  const res = await fetch(`${baseURl}/tasks/${id}/toggle`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const updatedTask = await res.json();
  return updatedTask;
};

export const editTask = async (id, data) => {
  const response = await fetch(baseURl + `/tasks/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: data }),
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to generate questions");
  }

  const res = await response.json();
  return res;
};

export const deleteTask = async (id) => {
  const response = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  return res;
};

export const generateSubTasks = async (taskId, data) => {
  const response = await fetch(baseURl + `/tasks/${taskId}/subtasks`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: data }),
  });
  // console.log(response);
  if (!response.ok) {
    throw new Error("Failed to generate questions");
  }

  const res = await response.json();
  return res;
};
export const toggleSubTaskData = async (taskId, subtaskId) => {
  const response = await fetch(
    `${baseURl}/tasks/${taskId}/subtask/${subtaskId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    },
  );
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to generate questions");
  }

  const res = await response.json();
  return res;
};
