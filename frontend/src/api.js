const API_BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("iris_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const data = await response.json();
      errorMessage = data.detail || data.message || errorMessage;
    } catch (e) {
      // JSON parsing failed
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const api = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },
    signup: async (name, email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(response);
    },
  },

  contacts: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    create: async (contactData) => {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(contactData),
      });
      return handleResponse(response);
    },
    update: async (id, contactData) => {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(contactData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  alerts: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    trigger: async (alertData) => {
      const response = await fetch(`${API_BASE_URL}/alerts/trigger`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(alertData),
      });
      return handleResponse(response);
    },
    resolve: async (id) => {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}/resolve`, {
        method: "PUT",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  settings: {
    get: async () => {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    update: async (settingsData) => {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(settingsData),
      });
      return handleResponse(response);
    },
  },

  familyFaces: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/family-faces`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    create: async (faceData) => {
      const response = await fetch(`${API_BASE_URL}/family-faces`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(faceData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/family-faces/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  emergency: {
    activate: async (payload) => {
      const response = await fetch(`${API_BASE_URL}/emergency/activate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload || {}),
      });
      return handleResponse(response);
    },
  },

  upload: {
    image: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const headers = {};
      const token = localStorage.getItem("iris_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse(response);
    },
  },
};

