import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './app/pages/LandingPage';
import { LoginPage } from './app/pages/LoginPage';
import { RegisterPage } from './app/pages/RegisterPage';
import { Dashboard } from './app/pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}