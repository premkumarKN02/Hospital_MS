import React, { useState } from 'react';
import { Button, Input, Badge, cn } from './ui-primitives';
import {
  Menu, X, ChevronLeft, ChevronRight, Bell, Search, Moon, Sun,
  User, LogOut, Settings, HelpCircle, ChevronDown
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
  children?: { id: string; label: string; href?: string }[];
}

export interface AppShellProps {
  appName: string;
  appLogo?: React.ReactNode;
  navItems: NavItem[];
  activeItemId: string;
  onNavigate: (id: string) => void;
  user: { name: string; role: string; avatarUrl?: string };
  onLogout: () => void;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

export function AppShell({
  appName,
  appLogo,
  navItems,
  activeItemId,
  onNavigate,
  user,
  onLogout,
  breadcrumbs = [{ label: 'Dashboard' }],
  children,
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ================= TOPBAR ================= */}
      <header className="h-16 border-b border-border bg-card sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted text-muted-foreground"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            {appLogo}
            <span className="font-bold text-lg tracking-tight hidden sm:inline">{appName}</span>
          </div>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="hidden md:flex items-center ml-6 gap-2 text-sm text-muted-foreground">
            <span>/</span>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-foreground' : 'hover:underline cursor-pointer'}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Topbar Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search (Ctrl + K)..."
              className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </Button>

          {/* User Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col text-left pr-1">
                <span className="text-xs font-semibold leading-tight">{user.name}</span>
                <span className="text-[10px] text-muted-foreground">{user.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden xl:inline" />
            </button>

            {/* User Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user.role}</p>
                </div>
                <button
                  onClick={() => { setIsProfileMenuOpen(false); onNavigate('settings'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                  Account Settings
                </button>
                <button
                  onClick={() => { setIsProfileMenuOpen(false); onNavigate('help'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  Help & Documentation
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => { setIsProfileMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN BODY ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= SIDEBAR ================= */}
        <aside
          className={cn(
            'bg-card border-r border-border transition-all duration-200 z-30 flex flex-col justify-between shrink-0',
            isSidebarCollapsed ? 'w-16' : 'w-64',
            'fixed md:relative inset-y-0 left-0 pt-16 md:pt-0 transform md:transform-none',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
        >
          {/* Navigation Links */}
          <div className="p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeItemId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left group',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span className={cn('shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <Badge variant={item.badgeVariant || 'default'}>
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Collapse Toggle (Desktop) */}
          <div className="hidden md:flex p-3 border-t border-border justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ================= CANVAS CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
