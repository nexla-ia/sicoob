import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Profile } from '../types/database';
import { api, authApi } from '../lib/api';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    // MOCK - comentado autenticação real
    const mockUser = localStorage.getItem('mock_user');
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      setUser(userData);
      setProfile(userData.profile);
    }
    setLoading(false);

    /* AUTENTICAÇÃO REAL - COMENTADA
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getProfile();
      if (response.data) {
        setUser({ id: response.data.id, email: response.data.email });
        setProfile(response.data);
      } else {
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
    */
  };

  const signIn = async (email: string, password: string) => {
    // MOCK - simula login com dados mockados
    const mockUserData = {
      id: 1,
      email: 'admin@sicoob.com.br',
      profile: {
        id: 1,
        email: 'admin@sicoob.com.br',
        full_name: 'Administrador Teste',
        role: 'admin' as 'admin' | 'analyst',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    localStorage.setItem('mock_user', JSON.stringify(mockUserData));
    setUser(mockUserData);
    setProfile(mockUserData.profile);

    /* AUTENTICAÇÃO REAL - COMENTADA
    const response = await authApi.login(email, password);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data?.access_token) {
      api.setToken(response.data.access_token);
      await loadProfile();
    } else {
      throw new Error('Token não recebido do servidor');
    }
    */
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // MOCK - comentado
    throw new Error('Cadastro desabilitado no modo mock');

    /* AUTENTICAÇÃO REAL - COMENTADA
    const response = await authApi.register(email, password, fullName);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data?.access_token) {
      api.setToken(response.data.access_token);
      await loadProfile();
    } else {
      throw new Error('Token não recebido do servidor');
    }
    */
  };

  const signOut = async () => {
    // MOCK
    localStorage.removeItem('mock_user');
    setUser(null);
    setProfile(null);

    /* AUTENTICAÇÃO REAL - COMENTADA
    api.setToken(null);
    setUser(null);
    setProfile(null);
    */
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
