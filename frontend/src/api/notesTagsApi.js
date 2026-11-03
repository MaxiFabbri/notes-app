import { apiClient } from '../config/axiosConfig.js';

export async function addTagToNote(noteId, tagId) {
  try {
    const response = await apiClient.post(`/notes/${noteId}/tags/${tagId}`);
    return response.data;
  } catch (error) {
    console.error('Error assigning tag:', error);
    throw error;
  }
}

export async function removeTagFromNote(noteId, tagId) {
  try {
    const response = await apiClient.delete(`/notes/${noteId}/tags/${tagId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing tag:', error);
    throw error;
  }
}
