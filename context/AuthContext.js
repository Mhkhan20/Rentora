// STEP 1: Auth Context Setup

// File: context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '@/lib/cognitoConfig';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = UserPool.getCurrentUser();
    if (currentUser) setUser(currentUser);
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

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
