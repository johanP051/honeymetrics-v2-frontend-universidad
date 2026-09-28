import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Blacklist from "./pages/Blacklist/blacklist.jsx";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import LandingPage from "./pages/LandingPage/landingPage.jsx";
import Login from "./pages/Login/login.jsx";
import Logs from "./pages/Logs/logs.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "blacklist",
        element: <Blacklist />,
      },
    ],
  },
  {
    path: "/home",
    element: <LandingPage />,
  },
  {
    path: "/logs",
    element: <Logs />,
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
