import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainLayout>
            <AppRoutes />
          </MainLayout>

          <Toaster
            position="top-right"
            gutter={14}
            toastOptions={{
              duration: 3800,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid var(--toast-border)',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
                backdropFilter: 'blur(20px)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                borderRadius: '22px'
              },
              success: {
                iconTheme: {
                  primary: 'rgb(var(--rgb-secondary))',
                  secondary: 'var(--toast-bg)'
                }
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: 'var(--toast-bg)'
                }
              }
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
