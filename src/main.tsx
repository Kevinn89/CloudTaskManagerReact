import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import AuthProvider from './context/AuthContext.tsx'
import ProjectProvider from './context/ProjectContext.tsx'
import OrgProvider from './context/OrgContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
        <OrgProvider>
          <App />
        </OrgProvider>
      </ProjectProvider>
    </AuthProvider>
  </BrowserRouter>

  // </StrictMode>
)
