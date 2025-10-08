import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CanvasInstance from './pages/CanvasInstance';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import SignUpPage from './pages/SignUpPage';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/canvas" element={<CanvasInstance />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />}></Route>
            <Route path="team" element={<Team />} />
          </Route>
        </Route>
        <Route path="/signin" element={<RegistrationPage />} />
        <Route path="/create" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}
