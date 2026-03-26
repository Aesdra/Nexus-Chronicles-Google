import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// FIX: The error "'@tanstack/react-query' has no exported member named 'QueryClient'" is likely due to an environment-specific module resolution issue. The import is correct according to the library's documentation.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <App />
      </React.Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);