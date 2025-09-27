// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import EventsPage from './pages/EventsPage';
// import ProfilePage from './pages/ProfilePage';
// import CertificatesPage from './pages/CertificatesPage';
// import AboutPage from './pages/AboutPage';
// import NotFoundPage from './pages/NotFoundPage';
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
// import { AuthProvider } from './context/AuthContext';
// import { EventProvider } from './context/EventContext';
// import { ThemeProvider } from './context/ThemeContext';
// import { NotificationProvider } from './context/NotificationContext';
// import Navbar from './components/Layout/Navbar';
// import Footer from './components/Layout/Footer';
/**
 * EventChain - Main Application Component
 * Sets up routing and wraps the entire application with context providers
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import CertificatesPage from './pages/CertificatesPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <div className="App">
      {/* Wrap entire app with context providers */}
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <EventProvider>
              <Router>
                <div className="app-container">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Protected Routes */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/certificates" element={
                        <ProtectedRoute>
                          <CertificatesPage />
                        </ProtectedRoute>
                      } />
                      
                      {/* 404 Route */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </EventProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
