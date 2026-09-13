import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Blacklist from "./pages/blacklist.jsx";
import Dashboard from "./pages/dashboard.jsx";
import LandingPage from "./pages/landingPage.jsx";
import Login from "./pages/login.jsx";

const router = createBrowserRouter([
  {
    path: "/Blacklist",
    element: <Blacklist/>,
  },
  {
    path: "/Dashboard",
    element: <Dashboard/>,
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
