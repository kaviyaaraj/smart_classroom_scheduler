import api from './api';

export const timetableService = {
  generateTimetable: async (data) => {
    const response = await api.post('/timetable/generate', data);
    return response.data;
  },

  getTimetable: async (params) => {
    const response = await api.get('/timetable', { params });
    return response.data;
  },

  getTeacherTimetable: async () => {
    const response = await api.get('/timetable/teacher');
    return response.data;
  },

  updateTimetable: async (id, data) => {
    const response = await api.put(`/timetable/${id}`, data);
    return response.data;
  },

  deleteTimetable: async (id) => {
    const response = await api.delete(`/timetable/${id}`);
    return response.data;
  }
};
