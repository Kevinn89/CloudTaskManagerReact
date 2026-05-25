import { Route, Routes } from 'react-router-dom';
import './App.css';
import CreateProjectPage from './pages/CreateProjectPage';
// import HomePage from './pages/HomePage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditProjectsPage from './pages/EditProjectPage';
import EditTaskPage from './pages/EditTaskPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';


function App() {

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/task/" element={<></>} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          <Route path="/projects/:projectId/edit" element={<EditProjectsPage />} />
          <Route path="/task/:taskId/edit" element={<EditTaskPage />} />
          <Route path="/projects/:projectId/create-task" element={<CreateTaskPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </main>
    </>
  )
}

export default App


