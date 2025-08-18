import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import setupStore from './redux/store/configureStore.js'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/themeContext.jsx';
import { ToastProvider } from './contexts/toastContext.jsx';
import './index.css'
import App from './App.jsx'

const store = setupStore();


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
