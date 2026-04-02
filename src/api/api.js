//const baseURl = "https://ai-mock-interviewer-354v.onrender.com";
const baseURl = "http://127.0.0.1:8000";
export const generateSubTasks = async (data) => {
  const response = await fetch(baseURl + "/generate-subtasks", {
    method: "POST",
    headers: {
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
