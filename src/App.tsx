import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import MyHives from './pages/MyHives'
import HiveDetails from './pages/HiveDetails'
import Alerts from './pages/Alerts'
import Insights from './pages/Insights'
import System from './pages/System'
import ExpoDashboard from './pages/ExpoDashboard'
import { ThemeProvider } from './components/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { IntroProvider, useIntro } from './context/IntroContext'
import CinematicIntro from './components/CinematicIntro'

import { useNavigate } from 'react-router-dom'

function IntroPage() {
  const navigate = useNavigate()
  return (
    <CinematicIntro
      onComplete={() => navigate('/overview')}
      onSkip={() => navigate('/overview')}
    />
  )
}

function AppContent() {
  const { showIntro, dismissIntro } = useIntro()

  return (
    <>
      {showIntro && (
        <CinematicIntro
          onComplete={dismissIntro}
          onSkip={dismissIntro}
        />
      )}
      <Routes>
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </>
  )
}

function AppRoutes() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/overview" element={<Overview />} />
          <Route path="/hives" element={<MyHives />} />
          <Route path="/hives/:id" element={<HiveDetails />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/system" element={<System />} />
          <Route path="/expo" element={<ExpoDashboard />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IntroProvider>
          <AppContent />
        </IntroProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

