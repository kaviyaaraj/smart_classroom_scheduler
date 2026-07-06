import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Timetable from './pages/Timetable';
import TimetableGenerator from './pages/TimetableGenerator';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Public standalone timetable generator — no login needed */}
          <Route path="/timetable-generator" element={<TimetableGenerator />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/timetable"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Timetable />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/timetable"
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <Timetable />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/timetable"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <Timetable />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/materials"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
