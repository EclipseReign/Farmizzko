const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token to localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token
const removeToken = () => {
  localStorage.removeItem('token');
};

// Headers with auth
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth API
export const auth = {
  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    const data = await response.json();
    setToken(data.access_token);
    return data.user;
  },
  
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    setToken(data.access_token);
    return data.user;
  },
  
  logout: () => {
    removeToken();
  }
};

// Player API
export const player = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/api/player/profile`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  }
};

// Buildings API
export const buildings = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/buildings`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }
    
    return await response.json();
  },
  
  create: async (buildingType, position) => {
    const response = await fetch(`${API_URL}/api/buildings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ buildingType, position })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create building');
    }
    
    return await response.json();
  },
  
  collect: async (buildingId) => {
    const response = await fetch(`${API_URL}/api/buildings/${buildingId}/collect`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to collect');
    }
    
    return await response.json();
  },
  
  delete: async (buildingId) => {
    const response = await fetch(`${API_URL}/api/buildings/${buildingId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete building');
    }
    
    return await response.json();
  }
};

// Quests API
export const quests = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/quests`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch quests');
    }
    
    return await response.json();
  },
  
  claim: async (questId) => {
    const response = await fetch(`${API_URL}/api/quests/${questId}/claim`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to claim quest');
    }
    
    return await response.json();
  }
};

// Market API
export const market = {
  purchase: async (itemId) => {
    const response = await fetch(`${API_URL}/api/market/purchase`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ itemId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to purchase');
    }
    
    return await response.json();
  }
};

export { setToken, removeToken, getToken };
