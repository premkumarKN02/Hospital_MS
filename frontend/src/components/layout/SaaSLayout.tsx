import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { getActiveBranch, setActiveBranch } from '../../utils/branchService';
import { getActiveCurrency, setActiveCurrency } from '../../utils/currencyService';

export interface SaaSLayoutProps {
  currentPage: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenVoice: () => void;
  onOpenAiCopilot: () => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
  overlays?: React.ReactNode;
}

export const SaaSLayout: React.FC<SaaSLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenVoice,
  onOpenAiCopilot,
  onOpenSearch,
  children,
  overlays
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeBranch, setActiveBranchState] = useState(getActiveBranch());
  const [activeCurrency, setActiveCurrencyState] = useState(getActiveCurrency());

  return (
    <div className="min-h-screen dashboard-canvas text-[#172033] dark:text-slate-100 font-sans transition-colors duration-150">
      {/* ── Fixed Left Sidebar / Aside Navigation (Desktop: 264px expanded / 76px collapsed) ── */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        activeBranch={activeBranch}
        onSelectBranch={(branch) => {
          const updated = setActiveBranch(branch.code);
          setActiveBranchState(updated);
        }}
      />

      {/* ── Main Application Shell & Canvas (Smooth coordinate layout with Sidebar) ── */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-250 ease-in-out ${
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[256px]'
        }`}
      >
        {/* ── Fixed Top Navigation Bar (60px height, seamless with aside bar) ── */}
        <TopNavbar
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenVoice={onOpenVoice}
          onOpenAiCopilot={onOpenAiCopilot}
          onOpenSearch={onOpenSearch}
          activeBranch={activeBranch}
          onSelectBranch={(branch) => {
            const updated = setActiveBranch(branch.code);
            setActiveBranchState(updated);
          }}
          activeCurrency={activeCurrency}
          onSelectCurrency={(currency) => {
            const updated = setActiveCurrency(currency.code);
            setActiveCurrencyState(updated);
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />

        {/* ── Main Page Content Area (Generous gap & breathing room below 60px fixed topbar) ── */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-[88px] sm:pt-[100px] lg:pt-[108px] pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* ── Fixed Modals, Drawers & Overlays ── */}
        {overlays}
      </div>
    </div>
  );
};
