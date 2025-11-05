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

// Crops API
export const crops = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/crops`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch crops');
    const data = await response.json();
    return data.crops || [];
  },
  
  plant: async (type, position, location = "main") => {
    const response = await fetch(`${API_URL}/api/crops`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, position, location })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to plant crop');
    }
    return await response.json();
  },
  
  harvest: async (cropId) => {
    const response = await fetch(`${API_URL}/api/crops/${cropId}/harvest`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to harvest');
    }
    return await response.json();
  },
  
  remove: async (cropId) => {
    const response = await fetch(`${API_URL}/api/crops/${cropId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to remove crop');
    return await response.json();
  },
  
  protect: async (cropId) => {
    const response = await fetch(`${API_URL}/api/crops/${cropId}/protect`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to protect crop');
    }
    return await response.json();
  }
};

// Animals API
export const animals = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/animals`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch animals');
    const data = await response.json();
    return data.animals || [];
  },
  
  add: async (type, position, location = "main") => {
    const response = await fetch(`${API_URL}/api/animals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, position, location })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add animal');
    }
    return await response.json();
  },
  
  feed: async (animalId) => {
    const response = await fetch(`${API_URL}/api/animals/${animalId}/feed`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to feed animal');
    }
    return await response.json();
  },
  
  collect: async (animalId) => {
    const response = await fetch(`${API_URL}/api/animals/${animalId}/collect`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to collect');
    }
    return await response.json();
  },
  
  remove: async (animalId) => {
    const response = await fetch(`${API_URL}/api/animals/${animalId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to remove animal');
    return await response.json();
  }
};

// Territory API
export const territory = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/territory`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch territory');
    const data = await response.json();
    return data.territories || [];
  },
  
  clear: async (position, location = "main") => {
    const response = await fetch(`${API_URL}/api/territory/clear`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ position, location })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to clear territory');
    }
    return await response.json();
  },
  
  generate: async () => {
    const response = await fetch(`${API_URL}/api/territory/generate`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to generate territory');
    return await response.json();
  }
};

// Pests API
export const pests = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/pests`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch pests');
    const data = await response.json();
    return data.pests || [];
  },
  
  chase: async (pestId) => {
    const response = await fetch(`${API_URL}/api/pests/${pestId}/chase`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to chase pest');
    }
    return await response.json();
  }
};

// Collections API
export const collections = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/collections`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch collections');
    return await response.json();
  },
  
  exchange: async (collectionId) => {
    const response = await fetch(`${API_URL}/api/collections/${collectionId}/exchange`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to exchange collection');
    }
    return await response.json();
  }
};

// Friends API
export const friends = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/friends`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch friends');
    const data = await response.json();
    return data.friends || [];
  },
  
  add: async (username) => {
    const response = await fetch(`${API_URL}/api/friends/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ friend_username: username })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add friend');
    }
    return await response.json();
  },
  
  help: async (friendId, helpType = "visit") => {
    const response = await fetch(`${API_URL}/api/friends/help`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ friend_id: friendId, help_type: helpType })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to help friend');
    }
    return await response.json();
  },
  
  getRequests: async () => {
    const response = await fetch(`${API_URL}/api/friends/requests`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch requests');
    const data = await response.json();
    return data.requests || [];
  }
};


export { setToken, removeToken, getToken };
