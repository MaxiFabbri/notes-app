import { apiClient } from '../config/axiosConfig.js';

export async function getTags() {
  try {
    const response = await apiClient.get('/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

export async function createTag(name) {
  try {
    const response = await apiClient.post('/tags', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
}

export async function deleteTag(id) {
  try {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}
