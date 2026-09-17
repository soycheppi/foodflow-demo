import React, { useState, useEffect } from 'react';

interface HeaderShellProps {
  children: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export default function HeaderShell({
  children,
  className = '',
  transparent = false,
}: HeaderShellProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseStyle =
    'fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ease-in-out';

  // Modern Glass/Floating logic
  const glassStyle = scrolled
    ? 'mx-4 mt-4 h-16 rounded-2xl bg-white/80 dark:bg-[#1a1c21]/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl'
    : 'h-20 bg-white dark:bg-[#1a1c21] border-b border-gray-100 dark:border-white/5 shadow-sm';

  const activeStyle =
    transparent && !scrolled ? 'bg-transparent border-transparent shadow-none h-20' : glassStyle;

  return (
    <header className={`${baseStyle} ${activeStyle} ${className}`}>
      <div className="w-full h-full flex items-center px-4 md:px-8">{children}</div>
    </header>
  );
}
