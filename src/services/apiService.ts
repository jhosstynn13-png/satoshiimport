const API_BASE_URL = '/api';

export const apiService = {
  async getCatalog() {
    const response = await fetch(`${API_BASE_URL}/catalog`);
    return response.json();
  },
  
  async updateCatalog(data: any) {
    const response = await fetch(`${API_BASE_URL}/catalog/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
