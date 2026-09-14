import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Blacklist from "./pages/Blacklist/blacklist.jsx";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import LandingPage from "./pages/LandingPage/landingPage.jsx";
import Login from "./pages/Login/login.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute/>,
    children: [
      {
        path: "/Blacklist",
        element: <Blacklist/>,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute/>,
    children: [
      {
        path: "/Dashboard",
        element: <Dashboard/>,
      }
    ],
  },
  {
    path: "/",
    element: <LandingPage/>,
  },
  {
    path: "/Login",
    element: <Login/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>,
);
