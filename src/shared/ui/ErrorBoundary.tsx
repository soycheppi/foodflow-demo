import { Component, ReactNode } from 'react';
import { t } from '@/config/locales';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * ErrorBoundary: catches runtime errors in lazy-loaded chunks and other React subtrees.
 * Displays a friendly recovery UI instead of a blank/crashed screen.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    // Detect network/chunk load failures distinctly
    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk');

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="fixed inset-0 z-9999 bg-[#0d0f12] flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-5xl">{this.state.isChunkError ? '📡' : '⚠️'}</div>

        <div>
          <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-2">
            {this.state.isChunkError ? t.common.connectionError : t.common.unexpectedError}
          </h2>
          <p className="text-white/40 text-sm font-medium max-w-sm">
            {this.state.isChunkError
              ? t.common.connectionErrorDesc
              : t.common.unexpectedErrorDesc}
          </p>
        </div>

        <button
          onClick={this.handleReload}
          className="px-8 py-3 bg-brand-red text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-brand-red/20"
        >
          {t.common.reloadPage}
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
