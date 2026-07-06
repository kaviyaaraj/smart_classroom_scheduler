import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { timetableService } from '../services/timetableService';
import { useAuth } from '../context/AuthContext';
import './Timetable.css';

const Timetable = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [selectedClass, setSelectedClass] = useState(user?.class || '');

  useEffect(() => {
    if (selectedClass) {
      loadTimetable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  const loadTimetable = async () => {
    try {
      const data = await timetableService.getTimetable({ class: selectedClass });
      setTimetable(data);
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-01:00', '02:00-03:00', '03:00-04:00'];

  const getClassForSlot = (day, timeSlot) => {
    return timetable.find(item => item.day === day && item.timeSlot === timeSlot);
  };

  return (
    <div className="timetable-page">
      <div className="timetable-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>Timetable</h1>
        {user?.role === 'admin' && (
          <input
            type="text"
            placeholder="Enter class name"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-input"
          />
        )}
      </div>

      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th>Time</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td className="time-slot">{slot}</td>
                {days.map(day => {
                  const classItem = getClassForSlot(day, slot);
                  return (
                    <td key={`${day}-${slot}`} className="class-cell">
                      {classItem ? (
                        <div className="class-info">
                          <div className="subject-name">{classItem.subject?.name}</div>
                          <div className="teacher-name">{classItem.teacher?.name}</div>
                          <div className="room-number">{classItem.classroom?.roomNumber}</div>
                        </div>
                      ) : (
                        <div className="empty-slot">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
