import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageRoute } from '../../types';

interface BreadcrumbsProps {
  currentTitle: string;
  onNavigate: (page: PageRoute) => void;
  parentPage?: { title: string; route: PageRoute };
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentTitle, onNavigate, parentPage }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 max-w-7xl mx-auto">
      <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slateSubtle-500">
        <li>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 hover:text-brand-800 transition-colors font-medium focus-visible:ring-1"
          >
            <Home className="w-3.5 h-3.5 text-brand-600" />
            <span>Home</span>
          </button>
        </li>

        {parentPage && (
          <>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slateSubtle-300" />
            </li>
            <li>
              <button
                onClick={() => onNavigate(parentPage.route)}
                className="hover:text-brand-800 transition-colors font-medium focus-visible:ring-1"
              >
                {parentPage.title}
              </button>
            </li>
          </>
        )}

        <li>
          <ChevronRight className="w-3.5 h-3.5 text-slateSubtle-300" />
        </li>

        <li aria-current="page" className="font-semibold text-brand-900 truncate max-w-[200px] sm:max-w-none">
          {currentTitle}
        </li>
      </ol>
    </nav>
  );
};
