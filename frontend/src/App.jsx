import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProjectList from "./pages/ProjectList";
import ProjectDisplay from "./pages/ProjectDisplay";
import TaskDisplay from "./pages/TaskDisplay";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDisplay />} />
        <Route path="/tasks/:taskId" element={<TaskDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
