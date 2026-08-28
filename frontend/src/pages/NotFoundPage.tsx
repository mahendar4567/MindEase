import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-sm">
        <Heart className="w-8 h-8" />
      </div>

      <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        The page you are looking for doesn't exist or might have been moved.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all"
        >
          <Home className="w-4 h-4" />
          {isAuthenticated ? 'Go to Dashboard' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
