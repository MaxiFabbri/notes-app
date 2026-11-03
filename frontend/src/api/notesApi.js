import { apiClient } from '../config/axiosConfig.js';

export async function getNotes({ isArchived, tagId } = {}) {
  try {
    const response = await apiClient.get('/notes', {
      params: {
        ...(isArchived !== undefined && { isArchived }),
        ...(tagId && { tagId }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

export async function createNote(note) {
  try {
    const response = await apiClient.post('/notes', note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

export async function updateNote(id, note) {
  try {
    const response = await apiClient.put(`/notes/${id}`, note);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

export async function deleteNote(id) {
  try {
    const response = await apiClient.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

export async function toggleArchiveNote(id, isArchived) {
  try {
    // Use PUT directly so an archive failure is logged only once.
    const response = await apiClient.put(`/notes/${id}`, { isArchived });
    return response.data;
  } catch (error) {
    console.error('Error changing note archive status:', error);
    throw error;
  }
}
