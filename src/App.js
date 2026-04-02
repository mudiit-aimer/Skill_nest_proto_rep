import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/auth" replace />;
};
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppContent = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/auth" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/security" element={<Security />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#181818',
          color: '#f0ebe0',
          border: '1px solid rgba(240,235,224,0.1)',
          borderRadius: '4px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.02em',
          fontWeight: 300,
          padding: '14px 20px',
        },
        success: { iconTheme: { primary: '#c9a84c', secondary: '#060606' } },
        error: { iconTheme: { primary: '#c0392b', secondary: '#fff' } },
      }}
    />
  </Router>
);

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
