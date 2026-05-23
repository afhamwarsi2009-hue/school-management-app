import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'aurora_token';
const USER_KEY = 'aurora_user';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

function readStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  const token = sessionStorage.getItem(TOKEN_KEY);
  const savedUser = sessionStorage.getItem(USER_KEY);
  if (!token || !savedUser || isTokenExpired(token)) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(savedUser), token };
  } catch {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const signOut = useCallback(() => {
    setSession({ user: null, token: null });
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    function handleAuthExpired() {
      signOut();
    }

    window.addEventListener('auth:expired', handleAuthExpired);
    const interval = window.setInterval(() => {
      if (sessionStorage.getItem(TOKEN_KEY) && isTokenExpired(sessionStorage.getItem(TOKEN_KEY))) {
        signOut();
      }
    }, 60000);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
      window.clearInterval(interval);
    };
  }, [signOut]);

  const value = useMemo(() => ({
    user: session.user,
    token: session.token,
    isAuthenticated: Boolean(session.token && session.user),
    signIn: ({ user: nextUser, token: nextToken }) => {
      if (!nextToken || isTokenExpired(nextToken)) {
        signOut();
        return;
      }
      setSession({ user: nextUser, token: nextToken });
      sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      sessionStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    },
    signOut
  }), [session, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
