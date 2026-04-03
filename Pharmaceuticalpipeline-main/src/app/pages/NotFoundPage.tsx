import { Link } from 'react-router';
import { AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="h-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-slate-100 mb-4">
          <AlertCircle className="size-8 text-slate-600" />
        </div>
        <h1 className="text-4xl font-semibold mb-2">404</h1>
        <p className="text-slate-600 mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
