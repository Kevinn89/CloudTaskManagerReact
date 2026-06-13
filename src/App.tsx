import { Route, Routes } from 'react-router-dom';
import './App.css';
import CreateProjectPage from './pages/CreateProjectPage';
// import HomePage from './pages/HomePage';
import AdminOrgPage from './pages/AdminOrgPage';
import CreateOrganizationPage from './pages/CreateOrganizationPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditProjectsPage from './pages/EditProjectPage';
import EditTaskPage from './pages/EditTaskPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OrganizationHomePage from './pages/OrganizationHomePage';
import OrganizationPage from './pages/OrganizationPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectTasksPage from './pages/ProjectTasksPage';
import RegisterPage from './pages/RegisterPage';
import { RoutePatterns } from './routes/Route';


function App() {

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path={RoutePatterns.login} element={<LoginPage />} />
          <Route path={RoutePatterns.register} element={<RegisterPage />} />
          <Route path={RoutePatterns.dashboardHome} element={<HomePage />} />

          <Route path={RoutePatterns.projects} element={<ProjectsPage />} />
          <Route path={RoutePatterns.createProject} element={<CreateProjectPage />} />
          <Route path={RoutePatterns.editProject} element={<EditProjectsPage />} />

          <Route path={RoutePatterns.createTask} element={<CreateTaskPage />} />
          <Route path={RoutePatterns.projectTasks} element={<ProjectTasksPage />} />
          <Route path={RoutePatterns.editTask} element={<EditTaskPage />} />

          <Route path={RoutePatterns.organizations} element={<OrganizationPage />} />
          <Route path={RoutePatterns.createOrganization} element={<CreateOrganizationPage />} />
          <Route path={RoutePatterns.organizationHome} element={<OrganizationHomePage isAllowed={false} />} />

          <Route path={RoutePatterns.adminOrganizations} element={<AdminOrgPage />} />
          <Route path={RoutePatterns.adminOrganizationHome} element={<OrganizationHomePage isAllowed={true} />} />

          <Route path="*" element={<NotFoundPage />} />



        </Routes>
      </main>
    </>
  )
}

export default App


