import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Login from './pages/Login';
import Register from './pages/Register'; 
import DashboardLayout from './components/layout/DashboardLayout';
import TeamDashboard from './pages/TeamDashboard';
import SetupPassword from './pages/SetupPassword';
import Projects from './pages/projects/Projects';
import MyReports from './pages/MyReports';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-password" element={<SetupPassword />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          <Route path="/team" element={<TeamDashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/my-reports" element={<MyReports />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;