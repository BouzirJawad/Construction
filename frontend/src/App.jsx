import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectList from "./pages/ProjectList";
import ProjectDisplay from "./pages/ProjectDisplay";
import TaskDisplay from "./pages/TaskDisplay";
import Header from "./pages/Header";
import Footer from "./pages/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/projects/:projectId" element={<ProjectDisplay />} />
            <Route path="/tasks/:taskId" element={<TaskDisplay />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
