import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import PriorAuthList from "./Pages/prior-auth-list";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PriorAuthList/>,
    },
  ]);
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
