import { Outlet } from 'react-router';
import { TopNavigation } from './TopNavigation';

export function RootLayout() {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <TopNavigation />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
