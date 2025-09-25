import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/themeContext.jsx';
import { ToastProvider } from './contexts/toastContext.jsx';
import './index.css'
import App from './App.jsx'
import { store } from "./store";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
