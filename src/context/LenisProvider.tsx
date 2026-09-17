import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// ─── Context ────────────────────────────────────────────────────────────────
const LenisContext = createContext<Lenis | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(LenisContext);

// ─── Provider ────────────────────────────────────────────────────────────────
interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  // Initialize Lenis once
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on every route change (replaces useScrollToTop)
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
}
