import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ConsumerHub from './pages/ConsumerHubGoogleSheets'

// Protect routes — redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('pf_user')
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/consumers"
          element={<ProtectedRoute><ConsumerHub /></ProtectedRoute>}
        />
        {/* Catch-all → back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
