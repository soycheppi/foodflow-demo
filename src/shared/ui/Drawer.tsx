import React, { useEffect } from 'react';
import { IconXMark } from '@/shared/icons/ActionIcons';
import { t } from '@/config/locales';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Drawer({
  isOpen,
  onClose,
  position = 'left',
  children,
  title,
  className = '',
}: DrawerProps) {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const baseClasses =
    'fixed inset-y-0 z-50 flex flex-col w-screen max-w-sm bg-white dark:bg-[#1a1c21] border-gray-200 dark:border-white/10 shadow-2xl transition-transform duration-300 ease-in-out';

  const positionClasses =
    position === 'left'
      ? `left-0 border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
      : `right-0 border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* DRAWER PANEL */}
      <div
        className={`${baseClasses} ${positionClasses} ${className}`}
        aria-modal="true"
        role="dialog"
        aria-label={title || t.common.menu}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide uppercase font-questrial">
            {title || t.common.menu}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-brand-red transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label={t.common.closeMenu}
          >
            <IconXMark size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">{children}</div>
      </div>
    </>
  );
}
