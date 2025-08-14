import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import setupStore from './redux/store/configureStore.js'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const store = setupStore();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
