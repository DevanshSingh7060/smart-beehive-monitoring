import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Grid3x3, BarChart2, Bell, Camera, BrainCircuit,
  FileText, Settings, LogOut, User, ChevronLeft, ChevronRight,
  Menu, X, Wifi, ChevronDown, RefreshCw,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hives', label: 'My Hives', icon: Grid3x3 },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: 2 },
  { path: '/camera', label: 'Camera Monitoring', icon: Camera },
  { path: '/ai', label: 'AI Insights', icon: BrainCircuit },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
]

function HiveSenseLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#d97706" opacity="0.15" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="16,7 23,11 23,19 16,23 9,19 9,11" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.6" />
          <circle cx="16" cy="15" r="3" fill="#d97706" />
          <line x1="16" y1="7" x2="16" y2="11" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="23" y1="11" x2="20" y2="13" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="23" y1="19" x2="20" y2="17" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="16" y1="23" x2="16" y2="19" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="9" y1="19" x2="12" y2="17" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="9" y1="11" x2="12" y2="13" stroke="#fbbf24" strokeWidth="1.2" />
        </svg>
      </div>
      {!collapsed && (
        <div>
          <div className="font-display font-semibold text-white text-[15px] leading-none tracking-tight">HiveSense</div>
          <div className="font-display text-[#d97706] text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5">AI</div>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const currentPage = navItems.find(n => location.pathname.startsWith(n.path))?.label ?? 'Dashboard'

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
        <HiveSenseLogo collapsed={collapsed} />
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-white/30 hover:text-white/70 transition-colors hidden lg:block">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative
              ${isActive
                ? 'bg-[#d97706]/15 text-[#fbbf24]'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            {!collapsed && (
              <span className="font-medium tracking-tight">{label}</span>
            )}
            {!collapsed && badge && (
              <span className="ml-auto bg-[#dc2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {badge}
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-3 bg-[#2d2b27] text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/8 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#d97706]/20 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-[#d97706]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[13px] font-medium truncate">Disha Patel</div>
              <div className="text-white/40 text-[11px] truncate">Pro Account</div>
            </div>
            <button className="text-white/30 hover:text-white/70 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d97706]/20 flex items-center justify-center">
              <User size={14} className="text-[#d97706]" />
            </div>
          </div>
        )}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="w-full flex items-center justify-center mt-2 text-white/30 hover:text-white/70 transition-colors">
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f5f0]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-[#1c1917] transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-[#1c1917] flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#e8e3db] px-4 lg:px-6 h-14 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-[#78716c] hover:text-[#1c1917]">
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-semibold text-[#1c1917] text-[15px] truncate">{currentPage}</h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Hive selector */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8e3db] bg-[#f7f5f0] text-[#1c1917] text-xs font-medium hover:border-[#d97706]/40 transition-colors">
              <Grid3x3 size={12} className="text-[#d97706]" />
              All Hives
              <ChevronDown size={12} className="text-[#78716c]" />
            </button>

            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16a34a]/8 border border-[#16a34a]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] live-dot" />
              <span className="text-[#16a34a] text-[11px] font-medium">System Online</span>
            </div>

            {/* Refresh */}
            <button className="w-8 h-8 rounded-lg border border-[#e8e3db] bg-[#f7f5f0] flex items-center justify-center text-[#78716c] hover:text-[#1c1917] hover:border-[#d4cfc7] transition-colors">
              <RefreshCw size={13} />
            </button>

            {/* Notifications */}
            <button className="relative w-8 h-8 rounded-lg border border-[#e8e3db] bg-[#f7f5f0] flex items-center justify-center text-[#78716c] hover:text-[#1c1917] hover:border-[#d4cfc7] transition-colors">
              <Bell size={13} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            </button>

            {/* User */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#d97706]/15 flex items-center justify-center">
                <User size={14} className="text-[#d97706]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
