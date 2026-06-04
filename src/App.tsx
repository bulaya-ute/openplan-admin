import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Users from './pages/Users';
import AccessControl from './pages/AccessControl';
import Versions from './pages/Versions';
import Backups from './pages/Backups';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/versions" element={<Versions />} />
          <Route path="/backups" element={<Backups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
