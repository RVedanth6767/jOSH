import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsPage from './pages/AnalyticsPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import EmployeeListPage from './pages/EmployeeListPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';

export default function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<Navigate replace to="/list" />} path="/" />
          <Route element={<EmployeeListPage />} path="/list" />
          <Route element={<EmployeeDetailsPage />} path="/details/:id" />
          <Route element={<AnalyticsPage />} path="/analytics" />
          <Route element={<MapPage />} path="/map" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
