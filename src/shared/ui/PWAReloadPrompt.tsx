import { useRegisterSW } from 'virtual:pwa-register/react';
import { IconCircleCheck } from '@/shared/icons/StatusIcons';
import { t } from '@/config/locales';

export default function PWAReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r?: ServiceWorkerRegistration) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error: unknown) {
      console.log('SW Register Error:', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-9999 animate-fade-in-up">
      <div className="bg-white dark:bg-[#1a1c21] rounded-2xl shadow-2xl shadow-brand-red/20 border border-brand-red/10 overflow-hidden max-w-sm flex flex-col p-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-brand-red/10 p-2 rounded-full text-brand-red">
            <IconCircleCheck size={24} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">
              {t.pwa.updateAvailable}
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
              {t.pwa.updateDesc}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => close()}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors uppercase tracking-widest"
          >
            {t.pwa.later}
          </button>
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex-1 py-2 rounded-xl text-xs font-black bg-brand-red text-white hover:bg-red-700 shadow-md shadow-brand-red/20 transition-all active:scale-95 uppercase tracking-widest"
          >
            {t.pwa.update}
          </button>
        </div>
      </div>
    </div>
  );
}
