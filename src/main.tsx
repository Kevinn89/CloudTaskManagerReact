import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import OrgProvider from './context/OrgContext.tsx'
import './index.css'
import { persistor, store } from './store/Store.tsx'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <OrgProvider>
          <App />
        </OrgProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </StrictMode>
)
