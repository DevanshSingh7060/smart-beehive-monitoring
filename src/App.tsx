import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import MyHives from './pages/MyHives'
import HiveDetails from './pages/HiveDetails'
import Alerts from './pages/Alerts'
import Insights from './pages/Insights'
import System from './pages/System'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/hives" element={<MyHives />} />
        <Route path="/hives/:id" element={<HiveDetails />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/system" element={<System />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
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
