// In client/src/App.tsx

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the Google provider
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';

const AppContent: React.FC = () => {
 const { user, loading } = useAuth();

 if (loading) {
  return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
<div className="text-center">
 <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
<p className="text-gray-600">Loading...</p>
 </div>
</div>
 );
}

 return user ? <Dashboard /> : <AuthPage />;
};

function App() {
return (
<GoogleOAuthProvider clientId="549855235916-71tpl54mohpoahk0bfvirpfl1jki32gc.apps.googleusercontent.com">
 <AuthProvider>
 <AppContent />
<Toaster
 position="top-right"
toastOptions={{
 duration: 3000,
 style: {
background: '#ffffff',
 color: '#374151',
 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
 borderRadius: '12px',
border: '1px solid #e5e7eb',
 },
 success: {
 iconTheme: {
 primary: '#10b981',
 secondary: '#ffffff',
 },
},
 error: {
 iconTheme: {
 primary: '#ef4444',
 secondary: '#ffffff',
},
},
}}
 />
 </AuthProvider>
</GoogleOAuthProvider>
);
}

export default App;