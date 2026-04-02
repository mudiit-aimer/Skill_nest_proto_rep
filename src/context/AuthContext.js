import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH === 'true';
const MOCK_USERS_KEY = 'sn_mock_users';
const MOCK_USER_ID_SEQ_KEY = 'sn_mock_user_id_seq';

const DEFAULT_MOCK_USERS = [
  { _id: 'u-1', name: 'Skillnest Admin', email: 'admin@skillnest.com', password: 'admin123', role: 'admin', enrolledCourses: [] },
  { _id: 'u-2', name: 'Test User', email: 'test@test.com', password: 'test123', role: 'user', enrolledCourses: [] },
];

const readJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getMockUsers = () => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (!stored) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
    localStorage.setItem(MOCK_USER_ID_SEQ_KEY, String(DEFAULT_MOCK_USERS.length + 1));
    return DEFAULT_MOCK_USERS;
  }
  return readJson(stored, DEFAULT_MOCK_USERS);
};

const setMockUsers = users => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const nextMockUserId = () => {
  const current = Number(localStorage.getItem(MOCK_USER_ID_SEQ_KEY) || '3');
  localStorage.setItem(MOCK_USER_ID_SEQ_KEY, String(current + 1));
  return `u-${current}`;
};

const parseBody = options => {
  if (!options?.body) return {};
  return readJson(options.body, {});
};

const createResponseError = message =>
  Object.assign(new Error(message), { response: { data: { message } } });

const makePublicUser = user => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  enrolledCourses: user.enrolledCourses || [],
});

const issueMockToken = userId => `mock-token:${userId}`;

const getUserFromToken = token => {
  if (!token || !token.startsWith('mock-token:')) return null;
  const userId = token.split(':')[1];
  return getMockUsers().find(u => u._id === userId) || null;
};

const mockAuthFetch = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();

  if (url === '/api/auth/login' && method === 'POST') {
    const { email, password } = parseBody(options);
    const user = getMockUsers().find(
      u => u.email.toLowerCase() === String(email || '').toLowerCase() && u.password === password
    );
    if (!user) throw createResponseError('invalid email or password');
    return { ...makePublicUser(user), token: issueMockToken(user._id) };
  }

  if (url === '/api/auth/register' && method === 'POST') {
    const { name, email, password } = parseBody(options);
    if (!name || !email || !password) throw createResponseError('all fields are required');
    if (String(password).length < 6) throw createResponseError('password must be at least 6 characters');

    const users = getMockUsers();
    const exists = users.some(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) throw createResponseError('email already exists');

    const newUser = {
      _id: nextMockUserId(),
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      role: 'user',
      enrolledCourses: [],
    };

    const updatedUsers = [...users, newUser];
    setMockUsers(updatedUsers);
    return { ...makePublicUser(newUser), token: issueMockToken(newUser._id) };
  }

  if (url === '/api/auth/me' && method === 'GET') {
    const token = localStorage.getItem('sn_token');
    const user = getUserFromToken(token);
    if (!user) throw createResponseError('unauthorized');
    return makePublicUser(user);
  }

  throw createResponseError('mock endpoint not implemented');
};

const apiFetch = async (url, options = {}) => {
  if (USE_MOCK_AUTH && url.startsWith('/api/auth/')) {
    return mockAuthFetch(url, options);
  }

  const token = localStorage.getItem('sn_token');
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.message || 'request failed'), { response: { data: err } });
    }
    return res.json();
  } catch (err) {
    if (url.startsWith('/api/auth/')) {
      return mockAuthFetch(url, options);
    }
    throw err;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sn_token');
    if (token) {
      apiFetch('/api/auth/me')
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('sn_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('sn_token', data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem('sn_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sn_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const data = await apiFetch('/api/auth/me');
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
