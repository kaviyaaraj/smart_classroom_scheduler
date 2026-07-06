import api from './api';

export const attendanceService = {
  markAttendance: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  getAttendance: async (params) => {
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  getStudentAttendance: async () => {
    const response = await api.get('/attendance/student');
    return response.data;
  },

  updateAttendance: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  }
};
