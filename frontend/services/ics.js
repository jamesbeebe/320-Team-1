import api from "./api"
export async function uploadICSFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    return await api.request('/upload/ics', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}
