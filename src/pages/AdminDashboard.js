import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { classroomService } from '../services/classroomService';
import { timetableService } from '../services/timetableService';
import { notificationService } from '../services/notificationService';
import { subjectService } from '../services/subjectService';
import { authService } from '../services/authService';
import api from '../services/api';
import './Dashboard.css';

const EMPTY_CLASSROOM = { name: '', roomNumber: '', capacity: '', building: '', floor: '' };
const EMPTY_SUBJECT = { name: '', code: '', department: '', semester: '', credits: '', class: '', teacher: '' };
const EMPTY_USER = { name: '', email: '', password: '', role: 'teacher', phone: '', department: '', class: '', rollNumber: '' };
const EMPTY_NOTIFICATION = { title: '', message: '', recipients: 'all_students', class: '' };

const SECTIONS = ['dashboard', 'classrooms', 'subjects', 'users', 'timetable', 'notifications'];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState({ teachers: 0, students: 0, timetables: 0 });
  const [notifications, setNotifications] = useState([]);

  // Forms
  const [classroomForm, setClassroomForm] = useState(EMPTY_CLASSROOM);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [subjectForm, setSubjectForm] = useState(EMPTY_SUBJECT);
  const [editingSubject, setEditingSubject] = useState(null);
  const [userForm, setUserForm] = useState(EMPTY_USER);
  const [notificationForm, setNotificationForm] = useState(EMPTY_NOTIFICATION);
  const [timetableClass, setTimetableClass] = useState('');
  const [timetableData, setTimetableData] = useState([]);
  const [timetableClass2, setTimetableClass2] = useState('');

  const [msg, setMsg] = useState({ text: '', type: '' });

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const loadAll = useCallback(async () => {
    try {
      const [cls, subs, usersRes] = await Promise.all([
        classroomService.getAllClassrooms(),
        subjectService.getAllSubjects(),
        api.get('/auth/users')
      ]);
      setClassrooms(cls);
      setSubjects(subs);
      const allUsers = usersRes.data;
      setTeachers(allUsers.filter(u => u.role === 'teacher'));
      setStats({
        teachers: allUsers.filter(u => u.role === 'teacher').length,
        students: allUsers.filter(u => u.role === 'student').length,
        timetables: cls.length
      });
    } catch {
      // fallback: load what we can
      try { const cls = await classroomService.getAllClassrooms(); setClassrooms(cls); } catch {}
      try { const subs = await subjectService.getAllSubjects(); setSubjects(subs); } catch {}
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch {}
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);
  useEffect(() => { if (activeSection === 'notifications') loadNotifications(); }, [activeSection, loadNotifications]);

  // ── Classrooms ──────────────────────────────────────────────
  const handleClassroomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClassroom) {
        await classroomService.updateClassroom(editingClassroom._id, classroomForm);
        showMsg('Classroom updated successfully');
        setEditingClassroom(null);
      } else {
        await classroomService.createClassroom(classroomForm);
        showMsg('Classroom created successfully');
      }
      setClassroomForm(EMPTY_CLASSROOM);
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error saving classroom', 'error');
    }
  };

  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    setClassroomForm({
      name: classroom.name,
      roomNumber: classroom.roomNumber,
      capacity: classroom.capacity,
      building: classroom.building || '',
      floor: classroom.floor || ''
    });
    setActiveSection('classrooms');
  };

  const handleDeleteClassroom = async (id) => {
    if (!window.confirm('Delete this classroom?')) return;
    try {
      await classroomService.deleteClassroom(id);
      showMsg('Classroom deleted');
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error deleting classroom', 'error');
    }
  };

  // ── Subjects ─────────────────────────────────────────────────
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...subjectForm };
      if (!payload.teacher) delete payload.teacher;
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, payload);
        showMsg('Subject updated successfully');
        setEditingSubject(null);
      } else {
        await subjectService.createSubject(payload);
        showMsg('Subject created successfully');
      }
      setSubjectForm(EMPTY_SUBJECT);
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error saving subject', 'error');
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      department: subject.department || '',
      semester: subject.semester || '',
      credits: subject.credits || '',
      class: subject.class || '',
      teacher: subject.teacher?._id || subject.teacher || ''
    });
    setActiveSection('subjects');
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await subjectService.deleteSubject(id);
      showMsg('Subject deleted');
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error deleting subject', 'error');
    }
  };

  // ── Users ─────────────────────────────────────────────────────
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(userForm);
      showMsg(`${userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1)} created successfully`);
      setUserForm(EMPTY_USER);
      loadAll();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error creating user', 'error');
    }
  };

  // ── Timetable ─────────────────────────────────────────────────
  const handleGenerateTimetable = async () => {
    if (!timetableClass.trim()) { showMsg('Please enter a class name', 'error'); return; }
    try {
      const res = await timetableService.generateTimetable({ class: timetableClass, semester: '1' });
      showMsg(`Timetable generated: ${res.count} entries created`);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error generating timetable', 'error');
    }
  };

  const handleViewTimetable = async () => {
    if (!timetableClass2.trim()) { showMsg('Please enter a class name', 'error'); return; }
    try {
      const data = await timetableService.getTimetable({ class: timetableClass2 });
      setTimetableData(data);
      if (data.length === 0) showMsg('No timetable found for this class', 'error');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error fetching timetable', 'error');
    }
  };

  const handleDeleteTimetableEntry = async (id) => {
    try {
      await timetableService.deleteTimetable(id);
      setTimetableData(prev => prev.filter(t => t._id !== id));
      showMsg('Entry deleted');
    } catch {
      showMsg('Error deleting entry', 'error');
    }
  };

  // ── Notifications ─────────────────────────────────────────────
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      await notificationService.createNotification(notificationForm);
      showMsg('Notification sent successfully');
      setNotificationForm(EMPTY_NOTIFICATION);
      loadNotifications();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error sending notification', 'error');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      showMsg('Notification deleted');
      loadNotifications();
    } catch {
      showMsg('Error deleting notification', 'error');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timetableByDay = days.reduce((acc, day) => {
    acc[day] = timetableData.filter(t => t.day === day).sort((a, b) => a.startTime?.localeCompare(b.startTime));
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <div className="user-info">
          <p>{user?.name}</p>
          <p className="role">{user?.role}</p>
        </div>
        <nav>
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              style={{ background: activeSection === s ? '#3498db' : '' }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button
            onClick={() => navigate('/timetable-generator')}
            style={{ background: '#8e44ad' }}
          >
            🗓 Quick Generator
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </div>

      <div className="main-content">
        <h1>Admin Dashboard</h1>

        {msg.text && (
          <div style={{
            padding: '12px 20px', borderRadius: 5, marginBottom: 20,
            background: msg.type === 'error' ? '#f8d7da' : '#d4edda',
            color: msg.type === 'error' ? '#721c24' : '#155724',
            border: `1px solid ${msg.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {msg.text}
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeSection === 'dashboard' && (
          <>
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Classrooms</h3>
                <p className="card-number">{classrooms.length}</p>
              </div>
              <div className="card">
                <h3>Total Subjects</h3>
                <p className="card-number">{subjects.length}</p>
              </div>
              <div className="card">
                <h3>Total Teachers</h3>
                <p className="card-number">{stats.teachers}</p>
              </div>
              <div className="card">
                <h3>Total Students</h3>
                <p className="card-number">{stats.students}</p>
              </div>
            </div>
            <div className="section">
              <h2>Quick Actions</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[['Manage Classrooms','classrooms'],['Manage Subjects','subjects'],['Manage Users','users'],['Generate Timetable','timetable'],['Send Notification','notifications']].map(([label, sec]) => (
                  <button key={sec} onClick={() => setActiveSection(sec)}
                    style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 5, cursor: 'pointer' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── CLASSROOMS ── */}
        {activeSection === 'classrooms' && (
          <>
            <div className="section">
              <h2>{editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}</h2>
              <form onSubmit={handleClassroomSubmit} className="form">
                {[['text','Classroom Name','name'],['text','Room Number','roomNumber'],['number','Capacity','capacity'],['text','Building','building'],['text','Floor','floor']].map(([type, placeholder, field]) => (
                  <input key={field} type={type} placeholder={placeholder} value={classroomForm[field]}
                    onChange={e => setClassroomForm({ ...classroomForm, [field]: e.target.value })}
                    required={['name','roomNumber','capacity'].includes(field)} />
                ))}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit">{editingClassroom ? 'Update Classroom' : 'Add Classroom'}</button>
                  {editingClassroom && (
                    <button type="button" onClick={() => { setEditingClassroom(null); setClassroomForm(EMPTY_CLASSROOM); }}
                      style={{ background: '#95a5a6' }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="section">
              <h2>All Classrooms ({classrooms.length})</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Room No.</th><th>Capacity</th><th>Building</th><th>Floor</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {classrooms.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>No classrooms added yet</td></tr>
                    ) : classrooms.map(c => (
                      <tr key={c._id}>
                        <td>{c.name}</td><td>{c.roomNumber}</td><td>{c.capacity}</td>
                        <td>{c.building || '-'}</td><td>{c.floor || '-'}</td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleEditClassroom(c)}
                            style={{ background: '#f39c12', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeleteClassroom(c._id)} className="delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── SUBJECTS ── */}
        {activeSection === 'subjects' && (
          <>
            <div className="section">
              <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <form onSubmit={handleSubjectSubmit} className="form">
                <input type="text" placeholder="Subject Name" value={subjectForm.name} required
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} />
                <input type="text" placeholder="Subject Code (e.g. CS101)" value={subjectForm.code} required
                  onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} />
                <input type="text" placeholder="Class (e.g. CS-A)" value={subjectForm.class} required
                  onChange={e => setSubjectForm({ ...subjectForm, class: e.target.value })} />
                <input type="text" placeholder="Department" value={subjectForm.department}
                  onChange={e => setSubjectForm({ ...subjectForm, department: e.target.value })} />
                <input type="number" placeholder="Semester" value={subjectForm.semester}
                  onChange={e => setSubjectForm({ ...subjectForm, semester: e.target.value })} />
                <input type="number" placeholder="Credits" value={subjectForm.credits}
                  onChange={e => setSubjectForm({ ...subjectForm, credits: e.target.value })} />
                <select value={subjectForm.teacher} onChange={e => setSubjectForm({ ...subjectForm, teacher: e.target.value })}>
                  <option value="">-- Assign Teacher (optional) --</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
                </select>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit">{editingSubject ? 'Update Subject' : 'Add Subject'}</button>
                  {editingSubject && (
                    <button type="button" onClick={() => { setEditingSubject(null); setSubjectForm(EMPTY_SUBJECT); }}
                      style={{ background: '#95a5a6' }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="section">
              <h2>All Subjects ({subjects.length})</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Code</th><th>Class</th><th>Department</th><th>Teacher</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {subjects.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>No subjects added yet</td></tr>
                    ) : subjects.map(s => (
                      <tr key={s._id}>
                        <td>{s.name}</td><td>{s.code}</td><td>{s.class || '-'}</td>
                        <td>{s.department || '-'}</td>
                        <td>{s.teacher?.name || 'Unassigned'}</td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleEditSubject(s)}
                            style={{ background: '#f39c12', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeleteSubject(s._id)} className="delete-btn">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── USERS ── */}
        {activeSection === 'users' && (
          <div className="section">
            <h2>Add New User</h2>
            <form onSubmit={handleUserSubmit} className="form">
              <input type="text" placeholder="Full Name" value={userForm.name} required
                onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
              <input type="email" placeholder="Email" value={userForm.email} required
                onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
              <input type="password" placeholder="Password" value={userForm.password} required
                onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
              <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <input type="text" placeholder="Phone" value={userForm.phone}
                onChange={e => setUserForm({ ...userForm, phone: e.target.value })} />
              <input type="text" placeholder="Department" value={userForm.department}
                onChange={e => setUserForm({ ...userForm, department: e.target.value })} />
              {userForm.role === 'student' && (
                <>
                  <input type="text" placeholder="Class (e.g. CS-A)" value={userForm.class}
                    onChange={e => setUserForm({ ...userForm, class: e.target.value })} />
                  <input type="text" placeholder="Roll Number" value={userForm.rollNumber}
                    onChange={e => setUserForm({ ...userForm, rollNumber: e.target.value })} />
                </>
              )}
              <button type="submit">Create User</button>
            </form>
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: '#2c3e50', marginBottom: 10 }}>Teachers ({stats.teachers})</h3>
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Department</th></tr></thead>
                  <tbody>
                    {teachers.length === 0
                      ? <tr><td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>No teachers found</td></tr>
                      : teachers.map(t => (
                        <tr key={t._id}><td>{t.name}</td><td>{t.email}</td><td>{t.department || '-'}</td></tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TIMETABLE ── */}
        {activeSection === 'timetable' && (
          <>
            <div className="section">
              <h2>Generate Timetable</h2>
              <p style={{ color: '#666', marginBottom: 10, fontSize: 13 }}>
                Make sure subjects with assigned teachers and classrooms exist before generating.
              </p>
              <div className="generate-form">
                <input type="text" placeholder="Class name (e.g. CS-A)" value={timetableClass}
                  onChange={e => setTimetableClass(e.target.value)} />
                <button onClick={handleGenerateTimetable}>Generate</button>
              </div>
            </div>
            <div className="section">
              <h2>View Timetable</h2>
              <div className="generate-form" style={{ marginBottom: 20 }}>
                <input type="text" placeholder="Class name (e.g. CS-A)" value={timetableClass2}
                  onChange={e => setTimetableClass2(e.target.value)} />
                <button onClick={handleViewTimetable}>View</button>
              </div>
              {timetableData.length > 0 && (
                <div className="table-container">
                  {days.map(day => timetableByDay[day].length > 0 && (
                    <div key={day} style={{ marginBottom: 20 }}>
                      <h3 style={{ color: '#2c3e50', marginBottom: 8 }}>{day}</h3>
                      <table>
                        <thead>
                          <tr><th>Time</th><th>Subject</th><th>Teacher</th><th>Classroom</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {timetableByDay[day].map(entry => (
                            <tr key={entry._id}>
                              <td>{entry.timeSlot}</td>
                              <td>{entry.subject?.name || '-'}</td>
                              <td>{entry.teacher?.name || '-'}</td>
                              <td>{entry.classroom?.name || '-'} ({entry.classroom?.roomNumber || '-'})</td>
                              <td>
                                <button onClick={() => handleDeleteTimetableEntry(entry._id)} className="delete-btn">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeSection === 'notifications' && (
          <>
            <div className="section">
              <h2>Send Notification</h2>
              <form onSubmit={handleNotificationSubmit} className="form">
                <input type="text" placeholder="Title" value={notificationForm.title} required
                  onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })} />
                <textarea placeholder="Message" value={notificationForm.message} required
                  onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })} />
                <select value={notificationForm.recipients}
                  onChange={e => setNotificationForm({ ...notificationForm, recipients: e.target.value })}>
                  <option value="all_students">All Students</option>
                  <option value="all_teachers">All Teachers</option>
                  <option value="specific_class">Specific Class</option>
                </select>
                {notificationForm.recipients === 'specific_class' && (
                  <input type="text" placeholder="Class Name (e.g. CS-A)" value={notificationForm.class} required
                    onChange={e => setNotificationForm({ ...notificationForm, class: e.target.value })} />
                )}
                <button type="submit">Send Notification</button>
              </form>
            </div>
            <div className="section">
              <h2>Sent Notifications ({notifications.length})</h2>
              {notifications.length === 0
                ? <p style={{ color: '#999' }}>No notifications sent yet.</p>
                : <div className="notifications">
                    {notifications.map(n => (
                      <div key={n._id} className="notification-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4>{n.title}</h4>
                            <p>{n.message}</p>
                            <small>To: {n.recipients}{n.class ? ` (${n.class})` : ''} &nbsp;|&nbsp; {new Date(n.createdAt).toLocaleString()}</small>
                          </div>
                          <button onClick={() => handleDeleteNotification(n._id)} className="delete-btn"
                            style={{ marginLeft: 10, whiteSpace: 'nowrap' }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
