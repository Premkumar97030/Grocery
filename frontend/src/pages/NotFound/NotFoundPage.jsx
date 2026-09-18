import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-9xl font-black text-emerald-100 select-none">404</div>
      <div className="-mt-12 space-y-4 max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900">Page Not Found</h1>
        <p className="text-gray-500 text-base">
          Oops! The page you're looking for doesn't exist or might have been moved.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Go to Homepage
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
