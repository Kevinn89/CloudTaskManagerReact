import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import OrgProvider from './context/OrgContext.tsx'
import './index.css'
import { store } from './store/Store.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <OrgProvider>
        <App />
      </OrgProvider>
    </BrowserRouter>
  </Provider>
  // </StrictMode>
)
