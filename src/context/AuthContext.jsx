import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRegister } from '../utils/api';

const DEFAULT_USERS = [
  { email: 'admin@glimmora.com', password: 'admin123', name: 'Admin User', role: 'admin', avatar: 'AU', company: 'Glimmora Inc' },
  { email: 'manager@glimmora.com', password: 'manager123', name: 'Sarah Chen', role: 'campaign_manager', avatar: 'SC', company: 'Glimmora Inc' },
  { email: 'analyst@glimmora.com', password: 'analyst123', name: 'Raj Patel', role: 'analyst', avatar: 'RP', company: 'Glimmora Inc' },
  { email: 'demo@glimmora.com', password: 'demo123', name: 'Demo User', role: 'viewer', avatar: 'DU', company: 'Demo Corp' },
];

const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'BRL', 'AUD', 'CAD'];

const AuthContext = createContext(null);

function loadRegisteredUsers() {
  try {
    const stored = localStorage.getItem('glimmora_registered_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('glimmora_registered_users', JSON.stringify(users));
}

function loadConnectedPlatforms() {
  try {
    const stored = localStorage.getItem('glimmora_connected_platforms');
    return stored ? JSON.parse(stored) : { google: false, meta: false, linkedin: false };
  } catch {
    return { google: false, meta: false, linkedin: false };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [currency, setCurrencyState] = useState('USD');
  const [registeredUsers, setRegisteredUsers] = useState(loadRegisteredUsers);
  const [connectedPlatforms, setConnectedPlatforms] = useState(loadConnectedPlatforms);

  const allUsers = [...DEFAULT_USERS, ...registeredUsers];

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('glimmora_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
        setIsFirstLogin(localStorage.getItem('glimmora_first_login') === 'true');
      }

      const storedCurrency = localStorage.getItem('glimmora_currency');
      if (storedCurrency && SUPPORTED_CURRENCIES.includes(storedCurrency)) {
        setCurrencyState(storedCurrency);
      }
    } catch {
      localStorage.removeItem('glimmora_user');
      localStorage.removeItem('glimmora_first_login');
    }
  }, []);

  function login(email, password) {
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    setIsAuthenticated(true);

    const loginKey = `glimmora_has_logged_in_${found.email}`;
    const hasLoggedInBefore = localStorage.getItem(loginKey);
    const firstLogin = !hasLoggedInBefore;
    setIsFirstLogin(firstLogin);

    localStorage.setItem('glimmora_user', JSON.stringify(safeUser));
    localStorage.setItem('glimmora_first_login', String(firstLogin));
    if (!hasLoggedInBefore) {
      localStorage.setItem(loginKey, 'true');
    }

    // Load platforms for this user
    const platformKey = `glimmora_platforms_${found.email}`;
    try {
      const stored = localStorage.getItem(platformKey);
      if (stored) setConnectedPlatforms(JSON.parse(stored));
      else setConnectedPlatforms({ google: false, meta: false, linkedin: false });
    } catch {
      setConnectedPlatforms({ google: false, meta: false, linkedin: false });
    }

    return { success: true, user: safeUser };
  }

  async function register(name, email, password, company, role) {
    const exists = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const avatar = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser = { email, password, name, role: role || 'admin', avatar, company: company || '' };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    saveRegisteredUsers(updated);

    // Also register on backend so user is stored in JSON file
    try {
      await apiRegister({ name, email, password, company: company || '', role: role || 'admin' });
    } catch {
      // Backend may be down - local auth still works
    }

    // Auto-login
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    setIsAuthenticated(true);
    setIsFirstLogin(true);

    localStorage.setItem('glimmora_user', JSON.stringify(safeUser));
    localStorage.setItem('glimmora_first_login', 'true');
    localStorage.setItem(`glimmora_has_logged_in_${email}`, 'true');

    return { success: true, user: safeUser };
  }

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
    setIsFirstLogin(false);
    localStorage.removeItem('glimmora_user');
    localStorage.removeItem('glimmora_first_login');
  }

  function completeOnboarding() {
    setIsFirstLogin(false);
    localStorage.setItem('glimmora_first_login', 'false');
  }

  function setCurrency(code) {
    if (SUPPORTED_CURRENCIES.includes(code)) {
      setCurrencyState(code);
      localStorage.setItem('glimmora_currency', code);
    }
  }

  const connectPlatform = useCallback((platform) => {
    setConnectedPlatforms((prev) => {
      const updated = { ...prev, [platform]: true };
      localStorage.setItem('glimmora_connected_platforms', JSON.stringify(updated));
      if (user) localStorage.setItem(`glimmora_platforms_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const disconnectPlatform = useCallback((platform) => {
    setConnectedPlatforms((prev) => {
      const updated = { ...prev, [platform]: false };
      localStorage.setItem('glimmora_connected_platforms', JSON.stringify(updated));
      if (user) localStorage.setItem(`glimmora_platforms_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isFirstLogin,
    login,
    register,
    logout,
    completeOnboarding,
    currency,
    setCurrency,
    SUPPORTED_CURRENCIES,
    connectedPlatforms,
    connectPlatform,
    disconnectPlatform,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
