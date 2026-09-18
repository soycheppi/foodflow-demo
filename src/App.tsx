import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/features/auth/AuthProvider';
import { router } from '@/app/routes/config';
import PWAReloadPrompt from '@/shared/ui/PWAReloadPrompt';

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-center" richColors closeButton />
        <PWAReloadPrompt />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;
