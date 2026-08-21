import { createContext, useContext, useEffect, useState } from 'react';
import { getApiBase } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.id) {
            setCurrentUser({
              id: data.id,
              username: data.username || data.email,
              name: data.name,
              role_type: data.role_type,
              email: data.email,
            });
            setIsAuthenticated(true);
            setEmailVerified(data.email_verified_at ? true : false);
          } else {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      // Attempt login
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, remember: rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Invalid email or password',
        };
      }

      // Fetch user data after successful login
      const userResponse = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser({
          id: userData.id,
          username: userData.username || userData.email,
          name: userData.name,
          role_type: userData.role_type,
          email: userData.email,
        });
        setIsAuthenticated(true);
        setEmailVerified(userData.email_verified_at ? true : false);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Connection error. Please try again.',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  // Register function
  const register = async (firstName, lastName, email, password, passwordConfirmation) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Registration failed',
          errors: data.errors || {},
        };
      }

      // Fetch user data after successful registration
      const userResponse = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser({
          id: userData.id,
          username: userData.username || userData.email,
          name: userData.name,
          role_type: userData.role_type,
          email: userData.email,
        });
        setIsAuthenticated(true);
        setEmailVerified(userData.email_verified_at ? true : false);
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Connection error. Please try again.',
      };
    }
  };

  // Resend verification email
  const resendVerification = async () => {
    try {
      await fetch(`${getApiBase()}/email/verification-notification`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Resend verification error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        emailVerified,
        login,
        register,
        logout,
        loading,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
