import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
