import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
// Import firebase helpers (omit the `.ts` extension to avoid resolution issues in some build environments)
import { auth, googleProvider, db, isFirestoreAvailable } from '@/lib/firebase';

interface FavoriteHouse {
  id: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  living_area: number;
  lot_area: number;
  built_year: number;
  grade: number;
  condition: number;
  latitude: number;
  longitude: number;
  waterfront: number;
  views: number;
  schools_nearby: number;
  distance_from_airport: number;
  addedAt: Date;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  favoriteHouses: string[]; // Keep this for backward compatibility
  favoriteHousesData: FavoriteHouse[]; // New field for complete house data
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  addToFavorites: (houseId: string) => Promise<void>;
  addHouseToFavorites: (house: FavoriteHouse) => Promise<void>;
  removeFromFavorites: (houseId: string) => Promise<void>;
  isHouseFavorited: (houseId: string) => boolean;
  getFavoriteHousesData: () => FavoriteHouse[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestoreEnabled, setFirestoreEnabled] = useState(false);

  // Check Firestore availability on mount
  useEffect(() => {
    const checkFirestore = async () => {
      const available = await isFirestoreAvailable();
      setFirestoreEnabled(available);
      if (!available) {
        console.warn('🔥 Firestore is not available. Running in authentication-only mode.');
        console.warn('💡 To enable full features:');
        console.warn('   1. Go to Firebase Console');
        console.warn('   2. Create a Firestore database');
        console.warn('   3. Set up security rules');
      }
    };
    checkFirestore();
  }, []);

  // Save user profile to localStorage as backup
  const saveProfileToLocalStorage = (profile: UserProfile) => {
    try {
      localStorage.setItem(`userProfile_${profile.uid}`, JSON.stringify(profile));
    } catch (error) {
      console.warn('Failed to save profile to localStorage:', error);
    }
  };

  // Load user profile from localStorage as fallback
  const loadProfileFromLocalStorage = (uid: string): UserProfile | null => {
    try {
      const stored = localStorage.getItem(`userProfile_${uid}`);
      if (stored) {
        const profile = JSON.parse(stored);
        // Convert date strings back to Date objects
        profile.createdAt = new Date(profile.createdAt);
        profile.updatedAt = new Date(profile.updatedAt);
        
        // Ensure favoriteHousesData exists and convert dates
        if (!profile.favoriteHousesData) {
          profile.favoriteHousesData = [];
        } else {
          profile.favoriteHousesData = profile.favoriteHousesData.map((house: any) => ({
            ...house,
            addedAt: new Date(house.addedAt)
          }));
        }
        
        return profile;
      }
    } catch (error) {
      console.warn('Failed to load profile from localStorage:', error);
    }
    return null;
  };

  // Create or update user profile in Firestore
  const createUserProfile = async (user: User, additionalData?: { username?: string }) => {
    if (!user) return;

    // If Firestore is not available, create a local profile only
    if (!firestoreEnabled) {
      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        username: additionalData?.username || user.displayName || '',
        favoriteHouses: [],
        favoriteHousesData: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUserProfile(fallbackProfile);
      saveProfileToLocalStorage(fallbackProfile);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          username: additionalData?.username || user.displayName || '',
          favoriteHouses: [],
          favoriteHousesData: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        saveProfileToLocalStorage(newProfile);
      } else {
        const existingProfile = userSnap.data() as UserProfile;
        if (additionalData?.username && additionalData.username !== existingProfile.username) {
          const updatedProfile = {
            ...existingProfile,
            username: additionalData.username,
            updatedAt: new Date(),
          };
          await updateDoc(userRef, { username: additionalData.username, updatedAt: new Date() });
          setUserProfile(updatedProfile);
          saveProfileToLocalStorage(updatedProfile);
        } else {
          setUserProfile(existingProfile);
          saveProfileToLocalStorage(existingProfile);
        }
      }
    } catch (error) {
      console.warn('Error creating/updating user profile:', error);
      // Try to load from localStorage first
      const localProfile = loadProfileFromLocalStorage(user.uid);
      if (localProfile) {
        setUserProfile(localProfile);
      } else {
        // Create a minimal profile if both Firestore and localStorage fail
        const fallbackProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          username: additionalData?.username || user.displayName || '',
          favoriteHouses: [],
          favoriteHousesData: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(fallbackProfile);
        saveProfileToLocalStorage(fallbackProfile);
      }
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (user: User) => {
    if (!user) return;

    // First try to load from localStorage for immediate availability
    const localProfile = loadProfileFromLocalStorage(user.uid);
    if (localProfile) {
      setUserProfile(localProfile);
    }

    // If Firestore is not available, use localStorage only
    if (!firestoreEnabled) {
      if (!localProfile) {
        const fallbackProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          username: user.displayName || '',
          favoriteHouses: [],
          favoriteHousesData: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(fallbackProfile);
        saveProfileToLocalStorage(fallbackProfile);
      }
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const firestoreProfile = userSnap.data() as UserProfile;
        setUserProfile(firestoreProfile);
        saveProfileToLocalStorage(firestoreProfile);
      } else {
        await createUserProfile(user);
      }
    } catch (error) {
      console.warn('Error loading user profile from Firestore:', error);
      // Use localStorage profile if available, otherwise create fallback
      if (!localProfile) {
        const fallbackProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          username: user.displayName || '',
          favoriteHouses: [],
          favoriteHousesData: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(fallbackProfile);
        saveProfileToLocalStorage(fallbackProfile);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, { displayName });
    await createUserProfile(userCredential.user, { username: displayName });

    return userCredential;
  };

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      // Try popup first
      const userCredential = await signInWithPopup(auth, googleProvider);
      await createUserProfile(userCredential.user);
      return userCredential;
    } catch (error: any) {
      // If popup is blocked or fails, provide helpful error message
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message?.includes('Cross-Origin-Opener-Policy')) {
        
        console.warn('Google Sign-in popup was blocked. Please:');
        console.warn('1. Allow popups for this site');
        console.warn('2. Or use email/password sign-in instead');
        
        // Re-throw with user-friendly message
        throw new Error('Google Sign-in popup was blocked. Please allow popups for this site or use email/password sign-in.');
      }
      
      // Re-throw other errors
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    if (user) {
      // Clear localStorage for this user
      try {
        localStorage.removeItem(`userProfile_${user.uid}`);
      } catch (error) {
        console.warn('Failed to clear localStorage on logout:', error);
      }
    }
    
    setUserProfile(null);
    await signOut(auth);
  };

  const updateUsername = async (username: string): Promise<void> => {
    if (!user || !userProfile) return;

    const updatedProfile = {
      ...userProfile,
      username,
      updatedAt: new Date(),
    };

    // Update local state immediately
    setUserProfile(updatedProfile);
    saveProfileToLocalStorage(updatedProfile);

    if (!firestoreEnabled) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 
        username,
        updatedAt: new Date()
      });
    } catch (error) {
      console.warn('Error updating username in Firestore:', error);
      // Local state is already updated, so this is not critical
    }
  };

  const addToFavorites = async (houseId: string): Promise<void> => {
    if (!user || !userProfile) return;

    // Prevent duplicates
    if (userProfile.favoriteHouses.includes(houseId)) return;

    const updatedProfile = {
      ...userProfile,
      favoriteHouses: [...userProfile.favoriteHouses, houseId],
      updatedAt: new Date(),
    };

    // Update local state immediately
    setUserProfile(updatedProfile);
    saveProfileToLocalStorage(updatedProfile);

    if (!firestoreEnabled) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favoriteHouses: arrayUnion(houseId),
        updatedAt: new Date()
      });
    } catch (error) {
      console.warn('Error adding to favorites in Firestore:', error);
      // Local state is already updated, so this is not critical
    }
  };

  const removeFromFavorites = async (houseId: string): Promise<void> => {
    if (!user || !userProfile) return;

    const updatedProfile = {
      ...userProfile,
      favoriteHouses: userProfile.favoriteHouses.filter(id => id !== houseId),
      favoriteHousesData: (userProfile.favoriteHousesData || []).filter(house => house.id !== houseId),
      updatedAt: new Date(),
    };

    // Update local state immediately
    setUserProfile(updatedProfile);
    saveProfileToLocalStorage(updatedProfile);

    if (!firestoreEnabled) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const houseToRemove = userProfile.favoriteHousesData?.find(house => house.id === houseId);
      
      await updateDoc(userRef, {
        favoriteHouses: arrayRemove(houseId),
        ...(houseToRemove && { favoriteHousesData: arrayRemove(houseToRemove) }),
        updatedAt: new Date()
      });
    } catch (error) {
      console.warn('Error removing from favorites in Firestore:', error);
      // Local state is already updated, so this is not critical
    }
  };

  const isHouseFavorited = (houseId: string): boolean => {
    return userProfile?.favoriteHouses.includes(houseId) || false;
  };

  const addHouseToFavorites = async (house: FavoriteHouse): Promise<void> => {
    if (!user || !userProfile) return;

    // Prevent duplicates
    if (userProfile.favoriteHouses.includes(house.id)) return;

    const houseWithTimestamp = { ...house, addedAt: new Date() };
    const updatedProfile = {
      ...userProfile,
      favoriteHouses: [...userProfile.favoriteHouses, house.id],
      favoriteHousesData: [...(userProfile.favoriteHousesData || []), houseWithTimestamp],
      updatedAt: new Date(),
    };

    // Update local state immediately
    setUserProfile(updatedProfile);
    saveProfileToLocalStorage(updatedProfile);

    if (!firestoreEnabled) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favoriteHouses: arrayUnion(house.id),
        favoriteHousesData: arrayUnion(houseWithTimestamp),
        updatedAt: new Date()
      });
    } catch (error) {
      console.warn('Error adding house to favorites in Firestore:', error);
      // Local state is already updated, so this is not critical
    }
  };

  const getFavoriteHousesData = (): FavoriteHouse[] => {
    return userProfile?.favoriteHousesData || [];
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUsername,
    addToFavorites,
    addHouseToFavorites,
    removeFromFavorites,
    isHouseFavorited,
    getFavoriteHousesData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};