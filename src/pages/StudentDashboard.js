import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { timetableService } from '../services/timetableService';
import { attendanceService } from '../services/attendanceService';
import { notificationService } from '../services/notificationService';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadTimetable();
    loadAttendance();
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTimetable = async () => {
    try {
      const data = await timetableService.getTimetable({ class: user?.class });
      setTimetable(data);
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const data = await attendanceService.getStudentAttendance();
      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter(a => a.status === 'present').length;
    return ((present / attendance.length) * 100).toFixed(2);
  };

  const getTodaySchedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return timetable.filter(item => item.day === today);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Student Panel</h2>
        <div className="user-info">
          <p>{user?.name}</p>
          <p className="role">{user?.role}</p>
          <p className="class-info">Class: {user?.class}</p>
        </div>
        <nav>
          <button onClick={() => navigate('/student/timetable')}>View Timetable</button>
          <button onClick={() => navigate('/student/attendance')}>View Attendance</button>
          <button onClick={() => navigate('/student/materials')}>Study Materials</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </div>

      <div className="main-content">
        <h1>Student Dashboard</h1>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Today's Classes</h3>
            <p className="card-number">{getTodaySchedule().length}</p>
          </div>
          <div className="card">
            <h3>Attendance</h3>
            <p className="card-number">{calculateAttendancePercentage()}%</p>
          </div>
          <div className="card">
            <h3>Total Classes</h3>
            <p className="card-number">{attendance.length}</p>
          </div>
          <div className="card">
            <h3>Notifications</h3>
            <p className="card-number">{notifications.length}</p>
          </div>
        </div>

        <div className="section">
          <h2>Today's Schedule</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Classroom</th>
                </tr>
              </thead>
              <tbody>
                {getTodaySchedule().length > 0 ? (
                  getTodaySchedule().map((item) => (
                    <tr key={item._id}>
                      <td>{item.timeSlot}</td>
                      <td>{item.subject?.name}</td>
                      <td>{item.teacher?.name}</td>
                      <td>{item.classroom?.roomNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No classes today</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h2>Recent Attendance</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 5).map((item) => (
                  <tr key={item._id}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.subject?.name}</td>
                    <td>
                      <span className={`status ${item.status}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h2>Notifications</h2>
          <div className="notifications">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif._id} className="notification-item">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
