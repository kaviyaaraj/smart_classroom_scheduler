import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { timetableService } from '../services/timetableService';
import { attendanceService } from '../services/attendanceService';
import { notificationService } from '../services/notificationService';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    student: '', subject: '', class: '', date: '', status: 'present'
  });

  useEffect(() => {
    loadTimetable();
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTimetable = async () => {
    try {
      const data = await timetableService.getTeacherTimetable();
      setTimetable(data);
    } catch (error) {
      console.error('Error loading timetable:', error);
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

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.markAttendance(attendanceData);
      alert('Attendance marked successfully');
      setShowAttendanceForm(false);
      setAttendanceData({ student: '', subject: '', class: '', date: '', status: 'present' });
    } catch (error) {
      alert('Error marking attendance');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTodaySchedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return timetable.filter(item => item.day === today);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Teacher Panel</h2>
        <div className="user-info">
          <p>{user?.name}</p>
          <p className="role">{user?.role}</p>
        </div>
        <nav>
          <button onClick={() => setShowAttendanceForm(!showAttendanceForm)}>Mark Attendance</button>
          <button onClick={() => navigate('/teacher/timetable')}>View Full Timetable</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </div>

      <div className="main-content">
        <h1>Teacher Dashboard</h1>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Today's Classes</h3>
            <p className="card-number">{getTodaySchedule().length}</p>
          </div>
          <div className="card">
            <h3>Total Classes</h3>
            <p className="card-number">{timetable.length}</p>
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
                  <th>Classroom</th>
                </tr>
              </thead>
              <tbody>
                {getTodaySchedule().length > 0 ? (
                  getTodaySchedule().map((item) => (
                    <tr key={item._id}>
                      <td>{item.timeSlot}</td>
                      <td>{item.subject?.name}</td>
                      <td>{item.classroom?.roomNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>No classes today</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAttendanceForm && (
          <div className="section">
            <h2>Mark Attendance</h2>
            <form onSubmit={handleAttendanceSubmit} className="form">
              <input
                type="text"
                placeholder="Student ID"
                value={attendanceData.student}
                onChange={(e) => setAttendanceData({ ...attendanceData, student: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Subject ID"
                value={attendanceData.subject}
                onChange={(e) => setAttendanceData({ ...attendanceData, subject: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Class"
                value={attendanceData.class}
                onChange={(e) => setAttendanceData({ ...attendanceData, class: e.target.value })}
                required
              />
              <input
                type="date"
                value={attendanceData.date}
                onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                required
              />
              <select
                value={attendanceData.status}
                onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              <button type="submit">Mark Attendance</button>
            </form>
          </div>
        )}

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

export default TeacherDashboard;
