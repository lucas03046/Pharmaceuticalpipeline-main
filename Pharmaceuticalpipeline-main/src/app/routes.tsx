import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PipelinePage } from './pages/PipelinePage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import SettingsPage from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'pipeline', Component: PipelinePage },
      { path: 'companies', Component: CompaniesPage },
      { path: 'companies/:companyId', Component: CompanyDetailPage },
      { path: 'news', Component: DataSourcesPage },
      { path: 'data-sources', Component: () => <Navigate to="/news" replace /> },
      { path: 'settings', Component: SettingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
