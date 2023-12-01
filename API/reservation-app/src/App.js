import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Import the Sidebar component
import Login from "./components/Login";
import Home from "./components/Home";
import Rooms from "./components/Rooms";
import Register from "./components/Register"; // Import the Register component
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import "./App.css"; // Ensure you have this CSS for basic styling
import Reservation from "./components/Reservation";

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Render the Sidebar component alongside your private routes */}
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />{" "}
            {/* Add the Register route */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <PrivateRoute>
                  <Rooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservation"
              element={
                <PrivateRoute>
                  <Reservation />
                </PrivateRoute>
              }
            />
            {/* Add more private routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
