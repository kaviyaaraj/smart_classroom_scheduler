import api from './api';

export const classroomService = {
  getAllClassrooms: async () => {
    const response = await api.get('/classrooms');
    return response.data;
  },

  getClassroom: async (id) => {
    const response = await api.get(`/classrooms/${id}`);
    return response.data;
  },

  createClassroom: async (classroomData) => {
    const response = await api.post('/classrooms', classroomData);
    return response.data;
  },

  updateClassroom: async (id, classroomData) => {
    const response = await api.put(`/classrooms/${id}`, classroomData);
    return response.data;
  },

  deleteClassroom: async (id) => {
    const response = await api.delete(`/classrooms/${id}`);
    return response.data;
  }
};
