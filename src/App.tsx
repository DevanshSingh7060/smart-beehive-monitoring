import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MyHives from './pages/MyHives'
import HiveDetails from './pages/HiveDetails'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Camera from './pages/Camera'
import AIInsights from './pages/AIInsights'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hives" element={<MyHives />} />
        <Route path="/hives/:id" element={<HiveDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/ai" element={<AIInsights />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
