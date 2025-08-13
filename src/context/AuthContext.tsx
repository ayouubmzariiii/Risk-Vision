import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (data: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Update Firebase user profile if needed
          if (userData.displayName !== user.displayName || userData.photoURL !== user.photoURL) {
            await updateFirebaseProfile(user, {
              displayName: userData.displayName,
              photoURL: userData.photoURL
            });
          }
        }
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (data: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const { email, password, ...profileData } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateFirebaseProfile(userCredential.user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });

      // Store user data in Firestore with default API configuration
      const userData = {
        ...profileData,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        apiConfig: {
          provider: 'riskvision',
          apiKey: 'sk-0d3cbfcd7feb478ea7ef1398aaa6a1b7',
          model: 'deepseek-chat'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist with default API configuration
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          apiConfig: {
            provider: 'riskvision',
            apiKey: 'sk-0d3cbfcd7feb478ea7ef1398aaa6a1b7',
            model: 'deepseek-chat'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      throw err;
    }
  };

  const logOut = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log out');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      // Update Firebase profile
      if (data.displayName || data.photoURL) {
        await updateFirebaseProfile(user, {
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL
        });
      }

      // Update user data in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          ...data,
          updatedAt: new Date()
        });
      } else {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          ...data,
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Reload user to get updated profile
      await user.reload();
      setUser({ ...user });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      if (!user || !user.email) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      throw err;
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setError(null);
      if (!user || !user.email) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      await deleteUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    updateProfile,
    changePassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};