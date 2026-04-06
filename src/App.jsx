import { Routes, Route } from "react-router-dom";
import TaskManagerUI from "./TaskManagerUI";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  console.log(import.meta.env.DEV);

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <TaskManagerUI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TaskManagerUI />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
