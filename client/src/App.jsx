import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Login from './pages/Login';
// We will build these next!
// import Apply from './pages/Apply'; 
// import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/apply" element={<Apply />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;