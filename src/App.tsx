import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { router } from '@/routes/config';
import PWAReloadPrompt from '@/shared/ui/PWAReloadPrompt';

const App = () => {
  return (
    
      <div className="App">
        <Toaster position="top-center" richColors closeButton />
        <PWAReloadPrompt />
        <RouterProvider router={router} />
      </div>
    
  );
};

export default App;
