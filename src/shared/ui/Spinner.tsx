import React from 'react';

interface SpinnerProps {
  label?: string;
  variant?: 'fullscreen' | 'inline';
}

const Spinner: React.FC<SpinnerProps> = ({ label = 'Cargando…', variant = 'inline' }) => {
  if (variant === 'inline') {
    return (
      <div
        className="w-full min-h-[40vh] py-16 flex flex-col justify-center items-center gap-4"
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <div className="animate-spin w-9 h-9 border-3 border-gray-200 dark:border-white/10 border-t-brand-red rounded-full" />
        <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-9999 bg-[#0d0f12] flex flex-col justify-center items-center gap-4"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="animate-spin w-10 h-10 border-4 border-white/10 border-t-brand-red rounded-full" />
      <span className="text-white/30 text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default Spinner;
