import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  timeFormat: '12h' | '24h';
  setTimeFormat: (format: '12h' | '24h') => void;
  formatTime: (date: Date) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock users for comprehensive testing
const mockUsers = [
  { 
    id: '1', 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin' as const, 
    name: 'System Administrator' 
  },
  { 
    id: '2', 
    username: 'staff1', 
    password: 'staff123', 
    role: 'staff' as const, 
    name: ' Office Staff' 
  },
  { 
    id: '3', 
    username: 'staff2', 
    password: 'staff123', 
    role: 'staff' as const, 
    name: 'Operations Staff' 
  },
  { 
    id: '4', 
    username: 'supervisor', 
    password: 'super123', 
    role: 'staff' as const, 
    name: 'Shift Supervisor' 
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');

  useEffect(() => {
    const savedUser = localStorage.getItem('busDispatchUser');
    const savedTimeFormat = localStorage.getItem('busDispatchTimeFormat') as '12h' | '24h';
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('busDispatchUser');
      }
    }
    
    if (savedTimeFormat) {
      setTimeFormat(savedTimeFormat);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (foundUser) {
      const userInfo = { 
        id: foundUser.id, 
        username: foundUser.username, 
        role: foundUser.role,
        name: foundUser.name
      };
      setUser(userInfo);
      localStorage.setItem('busDispatchUser', JSON.stringify(userInfo));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('busDispatchUser');
  };

  const handleTimeFormatChange = (format: '12h' | '24h') => {
    setTimeFormat(format);
    localStorage.setItem('busDispatchTimeFormat', format);
  };

  const formatTime = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      return '--:--';
    }
    
    try {
      if (timeFormat === '12h') {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      } else {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      timeFormat,
      setTimeFormat: handleTimeFormatChange,
      formatTime
    }}>
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