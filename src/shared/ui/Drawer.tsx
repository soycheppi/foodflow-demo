import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
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
  const baseClasses =
    'fixed inset-y-0 z-50 flex flex-col w-screen max-w-sm bg-white dark:bg-[#1a1c21] border-gray-200 dark:border-white/10 shadow-2xl transition-transform duration-300 ease-in-out';

  const positionClasses =
    position === 'left'
      ? `left-0 border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
      : `right-0 border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={`${baseClasses} ${positionClasses} ${className}`}
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 shrink-0">
            <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white tracking-wide uppercase font-questrial">
              {title || t.common.menu}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 -mr-2 text-gray-400 hover:text-brand-red transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label={t.common.closeMenu}
              >
                <IconXMark size={24} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
