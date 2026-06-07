import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function MainLayout({ children }) {
  const { profile, logout } = useStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: isAdmin ? '/admin' : '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    ...(isAdmin
      ? [
          {
            to: '/admin',
            label: 'Scanner',
            icon: ScanLine,
          },
        ]
      : []),
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-surface-900 text-white dark:bg-white dark:text-surface-900'
            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
        }`
      }
      onClick={() => setMobileMenuOpen(false)}
    >
      <item.icon className="w-4 h-4" />
      {item.label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 transition-colors duration-300">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-surface-950/80 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-surface-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-surface-900 font-bold text-xs">V</span>
              </div>
              <span className="font-semibold text-sm text-surface-900 dark:text-white hidden sm:inline">
                Vector Company
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <span className="text-xs text-surface-500 dark:text-surface-400 hidden sm:inline">
                {profile.full_name || profile.email}
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex">
        <aside className="hidden lg:flex flex-col w-56 p-4 gap-1 sticky top-14 h-[calc(100vh-3.5rem)]">
          {navItems.map((item) => (
            <NavItem key={item.to + item.label} item={item} />
          ))}
          <div className="flex-1" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-3.5rem)] p-4 lg:p-6">
          {children}
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <nav
            className="absolute top-14 left-0 w-64 h-[calc(100vh-3.5rem)] bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800 p-4 space-y-1 animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <NavItem key={item.to + item.label} item={item} />
            ))}
          </nav>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-surface-950/80 border-t border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => (
            <NavLink
              key={item.to + item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-surface-900 dark:text-white'
                    : 'text-surface-400 dark:text-surface-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
