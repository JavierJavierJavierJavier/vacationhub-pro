import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { RequestProvider } from './context/RequestContext'
import { ToastProvider } from './context/ToastContext'
import { EmployeeProvider } from './context/EmployeeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <EmployeeProvider>
            <RequestProvider>
              <App />
            </RequestProvider>
          </EmployeeProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
