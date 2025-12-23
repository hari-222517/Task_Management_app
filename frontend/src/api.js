import axios from 'axios';

// API client for backend communication
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

// Group API calls
export const getGroups = () => apiClient.get('/groups/');
export const createGroup = (group) => apiClient.post('/groups/', group);
export const getGroup = (groupId) => apiClient.get(`/groups/${groupId}`);
export const deleteGroup = (groupId) => apiClient.delete(`/groups/${groupId}`);

// Member API calls
export const addMember = (groupId, member) => apiClient.post(`/groups/${groupId}/members/`, member);
export const getMembers = (groupId) => apiClient.get(`/groups/${groupId}/members/`);
export const removeMember = (memberId) => apiClient.delete(`/members/${memberId}`);

// Task API calls
export const createTask = (groupId, task) => apiClient.post(`/groups/${groupId}/tasks/`, task);
export const getTasks = (groupId) => apiClient.get(`/groups/${groupId}/tasks/`);
export const updateTaskStatus = (taskId, status) => apiClient.put(`/tasks/${taskId}/status?status=${status}`);
export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`);
