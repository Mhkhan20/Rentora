'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '@/lib/cognitoConfig';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = UserPool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err || !session.isValid()) {
          setUser(null);
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: email, Pool: UserPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          setUser(cognitoUser);
          resolve(result);
        },
        onFailure: (err) => reject(err),
      });
    });
  };

  const signOut = () => {
    const currentUser = UserPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
      setUser(null);
      router.push('/');
    }
  };

  const getEmail = async () => {
    if (!user) return null;

    return new Promise((resolve) => {
      user.getSession((err, session) => {
        if (err || !session.isValid()) return resolve(null);
        const email = session.getIdToken().payload.email;
        resolve(email);
      });
    });
  };

  return (
    <AuthContext.Provider value={{ user, getEmail, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
