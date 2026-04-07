import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <TaskProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111",
                color: "#fff",
                borderRadius: "12px",
              },
            }}
          />
          <App />
        </TaskProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
