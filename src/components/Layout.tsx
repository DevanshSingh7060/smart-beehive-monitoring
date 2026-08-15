import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Grid3x3,
  BarChart2,
  Bell,
  Camera,
  BrainCircuit,
  FileText,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Radio,
  ChevronDown,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { hives, alerts } from '../data/mockData'

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hives', label: 'My Hives', icon: Grid3x3 },
  { path: '/ai', label: 'AI Intelligence', icon: BrainCircuit },
  { path: '/camera', label: 'Live Camera', icon: Camera },
]

const secondaryNavItems = [
  { path: '/analytics', label: 'Analytics & Sensors', icon: BarChart2 },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: 2 },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const allNavItems = [...mainNavItems, ...secondaryNavItems]

function HiveSenseLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0 w-8 h-8 rounded-xl bg-[#d97706]/15 flex items-center justify-center border border-[#d97706]/30">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <polygon
            points="16,2 28,9 28,23 16,30 4,23 4,9"
            fill="#d97706"
            opacity="0.25"
            stroke="#d97706"
            strokeWidth="1.8"
          />
          <polygon
            points="16,7 23,11 23,19 16,23 9,19 9,11"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="15" r="3.2" fill="#d97706" />
        </svg>
      </div>
      {!collapsed && (
        <div>
          <div className="font-display font-bold text-white text-[15px] leading-tight tracking-tight flex items-center gap-1.5">
            <span>HiveSense</span>
            <span className="bg-[#d97706] text-white text-[9px] font-black px-1 py-0.2 rounded uppercase">
              AI
            </span>
          </div>
          <div className="text-white/40 text-[10px] tracking-wide">Smart Apiary Platform</div>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedHive, setSelectedHive] = useState('ALL')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastSynced, setLastSynced] = useState('10s ago')
  const [showNotifications, setShowNotifications] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const currentPage =
    allNavItems.find(n => location.pathname === n.path || location.pathname.startsWith(n.path + '/'))?.label ??
    'Dashboard'

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastSynced('Just now')
    }, 800)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f5f0] text-[#1c1917]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-[#1c1917] border-r border-white/8 transition-all duration-250 z-30 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/8">
          <HiveSenseLogo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {/* Main Core Section */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">
                Core Platform
              </div>
            )}
            {mainNavItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group
                  ${
                    isActive
                      ? 'bg-[#d97706] text-white shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/6'
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#292524] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-white/10">
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Deep Diagnostics & Tools */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">
                Diagnostics & Tools
              </div>
            )}
            {secondaryNavItems.map(({ path, label, icon: Icon, badge }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group
                  ${
                    isActive
                      ? 'bg-[#d97706] text-white shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/6'
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && badge && (
                  <span className="ml-auto bg-[#dc2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badge}
                  </span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#292524] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-white/10">
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-white/8">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/8">
              <div className="w-9 h-9 rounded-xl bg-[#d97706]/20 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-[#fbbf24]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold truncate">Disha Patel</div>
                <div className="text-white/40 text-[10px] truncate">Apiary Manager · Pro</div>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="text-white/40 hover:text-[#dc2626] transition-colors p-1"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#d97706]/20 flex items-center justify-center">
                <User size={16} className="text-[#fbbf24]" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#1c1917]/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#1c1917] flex flex-col z-50 p-4 animate-in slide-in-from-left duration-250">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <HiveSenseLogo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">
                  Navigation
                </div>
                {allNavItems.map(({ path, label, icon: Icon, badge }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-[#d97706] text-white shadow-sm'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className="bg-[#dc2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/8 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#d97706]/20 flex items-center justify-center">
                  <User size={16} className="text-[#fbbf24]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold">Disha Patel</div>
                  <div className="text-white/40 text-[10px]">Patel Apiaries · 12 Hives</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/login')
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-medium"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#e8e3db] px-4 lg:px-6 h-16 flex items-center justify-between gap-3 flex-shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-[#f7f5f0] border border-[#e8e3db] flex items-center justify-center text-[#1c1917] hover:bg-[#ede9e3]"
              title="Open Navigation"
            >
              <Menu size={18} />
            </button>

            {/* Current Page or Hive Selector */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base sm:text-lg text-[#1c1917] truncate">
                  {currentPage}
                </h1>
              </div>
              <p className="hidden sm:block text-[11px] text-[#78716c] truncate">
                AI + IoT Apiary Management System
              </p>
            </div>
          </div>

          {/* Right Header Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hive Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedHive}
                onChange={e => setSelectedHive(e.target.value)}
                className="appearance-none bg-[#f7f5f0] hover:bg-[#ede9e3] border border-[#e8e3db] text-[#1c1917] text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl outline-none focus:border-[#d97706] cursor-pointer transition-colors"
              >
                <option value="ALL">All Hives (Apiary)</option>
                {hives.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.location}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716c] pointer-events-none"
              />
            </div>

            {/* Real-time Telemetry Status */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#16a34a]/8 border border-[#16a34a]/20">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] live-dot" />
              <span className="text-[#16a34a] text-xs font-semibold">Live Telemetry</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`w-9 h-9 rounded-xl border border-[#e8e3db] bg-[#f7f5f0] flex items-center justify-center text-[#78716c] hover:text-[#1c1917] hover:border-[#d4cfc7] transition-all
              ${isRefreshing ? 'animate-spin text-[#d97706]' : ''}`}
              title={`Last synced: ${lastSynced}. Click to refresh`}
            >
              <RefreshCw size={14} />
            </button>

            {/* Notification Bell with Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 rounded-xl border border-[#e8e3db] bg-[#f7f5f0] flex items-center justify-center text-[#78716c] hover:text-[#1c1917] hover:border-[#d4cfc7] transition-colors"
                title="Notifications"
              >
                <Bell size={15} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#dc2626] rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#e8e3db] shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-[#f0ede8] mb-3">
                      <div className="flex items-center gap-1.5">
                        <Bell size={14} className="text-[#d97706]" />
                        <span className="font-display font-semibold text-sm text-[#1c1917]">
                          Active Alerts & Insights
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setShowNotifications(false)
                          navigate('/alerts')
                        }}
                        className="text-[11px] text-[#d97706] hover:underline font-medium"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {alerts.slice(0, 3).map(a => (
                        <div
                          key={a.id}
                          onClick={() => {
                            setShowNotifications(false)
                            navigate('/alerts')
                          }}
                          className="p-2.5 rounded-xl bg-[#f7f5f0] border border-[#e8e3db] hover:border-[#d97706]/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase
                              ${
                                a.severity === 'critical'
                                  ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
                                  : 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
                              }`}
                            >
                              {a.severity}
                            </span>
                            <span className="text-[10px] text-[#a09890]">{a.time}</span>
                          </div>
                          <div className="text-xs font-semibold text-[#1c1917]">{a.type}</div>
                          <div className="text-[11px] text-[#78716c] line-clamp-1 mt-0.5">
                            {a.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto pb-mobile-nav">
          {children}
        </main>

        {/* Dedicated Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e3db] px-2 py-1.5 flex items-center justify-around shadow-lg">
          {mainNavItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150
                ${
                  isActive
                    ? 'text-[#d97706] font-semibold scale-105'
                    : 'text-[#78716c] hover:text-[#1c1917] font-medium'
                }`
              }
            >
              <Icon size={19} className="mb-0.5" />
              <span className="text-[10px] leading-tight tracking-tight">{label}</span>
            </NavLink>
          ))}

          {/* More menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#78716c] hover:text-[#1c1917] font-medium"
          >
            <Menu size={19} className="mb-0.5" />
            <span className="text-[10px] leading-tight tracking-tight">More</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
