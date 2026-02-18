// import { useState, useCallback, useContext } from 'react';
// import { logger } from '../utils/logger';
// import { useToast } from './ToastProvider';
// import { getPerformance, getProfile, updateProfile } from '../services/Profile/profile.api';
// import { LoaderContext } from '../context/LoaderContext';

// export const useProfile = () => {
//   const { toast } = useToast();
//    const { show, hide } = useContext(LoaderContext);
//   const [profile, setProfile] = useState<any>(null);
//   const [performance, setPerformance] = useState<any>(null);
//   const [isLoadingProfile, setIsLoadingProfile] = useState(false);
//   const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   const fetchProfile = useCallback(async () => {
//     try {
//       show();
//       setIsLoadingProfile(true);
//       const res = await getProfile();
//       if (res?.success) setProfile(res?.data);
//     } catch (e) {
//       logger.log('fetchProfile error', e);
//     } finally {
//       hide();
//       setIsLoadingProfile(false);
//     }
//   }, []);

//   const fetchPerformance = useCallback(async () => {
//   try {
//     show();
//     setIsLoadingPerformance(true);
//     const res = await getPerformance();
//     logger.log('fetchPerformance res', res);
//     if (res?.success) {
//       setPerformance(res?.stats); // ✅ not res?.data
//     }
//   } catch (e) {
//     logger.log('fetchPerformance error', e);
//   } finally {
//     hide();
//     setIsLoadingPerformance(false);
//   }
// }, []);

// const saveProfile = async (payload: {
//   display_name?: string;
//   phone?: string;
//   password?: string;
//   image?: {
//     uri: string;
//     name: string;
//     type: string;
//   } | null;
// }) => {
//   try {
//     show();
//     setIsUpdating(true);
//     const res = await updateProfile(payload);
//     if (res?.success) {
//       setProfile(res?.data);
//       toast(res?.message || 'Profile updated', 'success', 3000);
//     }
//     return res;
//   } catch (e) {
//     logger.log('saveProfile error', e);
//     toast((e as Error)?.message || 'Update failed', 'error', 3000);
//   } finally {
//     hide();
//     setIsUpdating(false);
//   }
// };

//   return {
//     profile,
//     performance,
//     isLoadingProfile,
//     isLoadingPerformance,
//     isUpdating,
//     fetchProfile,
//     fetchPerformance,
//     saveProfile,
//   };
// };

// import { useState, useCallback, useContext } from 'react';
// import { logger } from '../utils/logger';
// import { useToast } from './ToastProvider';
// import { getPerformance, getProfile, updateProfile } from '../services/Profile/profile.api';
// import { LoaderContext } from '../context/LoaderContext';
// import { AuthContext } from '../context/AuthContext';

// export const useProfile = () => {
//   const { toast }       = useToast();
//   const { show, hide }  = useContext(LoaderContext);
//   const { updateUser }  = useContext(AuthContext); // ← pull updateUser

//   const [profile, setProfile]                   = useState<any>(null);
//   const [performance, setPerformance]           = useState<any>(null);
//   const [isLoadingProfile, setIsLoadingProfile] = useState(false);
//   const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
//   const [isUpdating, setIsUpdating]             = useState(false);

//   // ── fetchProfile ────────────────────────────────────────────────────────────
//   // Fetches latest profile from API, updates local state AND AuthContext so
//   // every screen reading user from AuthContext gets fresh data immediately.
//   // ─────────────────────────────────────────────────────────────────────────────
//   const fetchProfile = useCallback(async () => {
//     try {
//       show();
//       setIsLoadingProfile(true);
//       const res = await getProfile();
//       logger.log('=========== fetchProfile res ===========', res);
//       if (res?.success) {
//         setProfile(res?.data);
//         await updateUser(res?.data); // ← sync to AuthContext + AsyncStorage
//       }
//     } catch (e) {
//       logger.log('fetchProfile error', e);
//     } finally {
//       hide();
//       setIsLoadingProfile(false);
//     }
//   }, [updateUser]);

//   const fetchPerformance = useCallback(async () => {
//     try {
//       show();
//       setIsLoadingPerformance(true);
//       const res = await getPerformance();
//       logger.log('fetchPerformance res', res);
//       if (res?.stats) setPerformance(res?.stats);
//     } catch (e) {
//       logger.log('fetchPerformance error', e);
//     } finally {
//       hide();
//       setIsLoadingPerformance(false);
//     }
//   }, []);

//   // ── saveProfile ─────────────────────────────────────────────────────────────
//   // After a successful update, syncs the new profile into AuthContext so
//   // the header / any screen showing user name or avatar updates instantly.
//   // ─────────────────────────────────────────────────────────────────────────────
//   const saveProfile = async (payload: {
//     display_name?: string;
//     phone?: string;
//     password?: string;
//     image?: { uri: string; name: string; type: string } | null;
//   }) => {
//     try {
//       show();
//       setIsUpdating(true);
//       const res = await updateProfile(payload);
//       if (res?.success) {
//         setProfile(res?.data);
//         await updateUser(res?.data); // ← sync to AuthContext + AsyncStorage
//         toast(res?.message || 'Profile updated', 'success', 3000);
//       }
//       return res;
//     } catch (e) {
//       logger.log('saveProfile error', e);
//       toast((e as Error)?.message || 'Update failed', 'error', 3000);
//     } finally {
//       hide();
//       setIsUpdating(false);
//     }
//   };

//   return {
//     profile,
//     performance,
//     isLoadingProfile,
//     isLoadingPerformance,
//     isUpdating,
//     fetchProfile,
//     fetchPerformance,
//     saveProfile,
//   };
// };

import { useState, useCallback, useContext } from 'react';
import { logger } from '../utils/logger';
import { useToast } from './ToastProvider';
import { getPerformance, getProfile, updateProfile } from '../services/Profile/profile.api';
import { LoaderContext } from '../context/LoaderContext';
import { AuthContext } from '../context/AuthContext';

export const useProfile = () => {
  const { toast }       = useToast();
  const { show, hide }  = useContext(LoaderContext);
  const { updateUser }  = useContext(AuthContext);

  const [profile, setProfile]                           = useState<any>(null);
  const [performance, setPerformance]                   = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile]         = useState(false);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [isUpdating, setIsUpdating]                     = useState(false);

  // ── fetchProfile ────────────────────────────────────────────────────────────
  // res: { success, message, data: { runner profile } }
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      show();
      setIsLoadingProfile(true);
      const res = await getProfile();
      logger.log('fetchProfile res:', res);

      if (res?.success) {
        setProfile(res.data);
        await updateUser(res.data); // sync to AuthContext + AsyncStorage
      }
    } catch (e) {
      logger.log('fetchProfile error:', e);
    } finally {
      hide();
      setIsLoadingProfile(false);
    }
  }, [updateUser]);

  // ── fetchPerformance ────────────────────────────────────────────────────────
  // res: { success, message, stats: { ... } }
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchPerformance = useCallback(async () => {
    try {
      show();
      setIsLoadingPerformance(true);
      const res = await getPerformance();
      logger.log('fetchPerformance res:', res);

      if (res?.success) {
        setPerformance(res.data.stats); // stats not data — as per API shape
      }
    } catch (e) {
      logger.log('fetchPerformance error:', e);
    } finally {
      hide();
      setIsLoadingPerformance(false);
    }
  }, []);

  // ── saveProfile ─────────────────────────────────────────────────────────────
  // res: { success, message, data: { updated runner } }
  // ─────────────────────────────────────────────────────────────────────────────
  const saveProfile = async (payload: {
    display_name?: string;
    phone?:        string;
    password?:     string;
    image?:        { uri: string; name: string; type: string } | null;
  }) => {
    try {
      show();
      setIsUpdating(true);
      const res = await updateProfile(payload);
      logger.log('saveProfile res:', res);

      if (res?.success) {
        setProfile(res.data);
        await updateUser(res.data); // sync to AuthContext + AsyncStorage
        toast(res?.message || 'Profile updated', 'success', 3000);
      }
      return res;
    } catch (e) {
      logger.log('saveProfile error:', e);
      toast((e as Error)?.message || 'Update failed', 'error', 3000);
    } finally {
      hide();
      setIsUpdating(false);
    }
  };

  return {
    profile,
    performance,
    isLoadingProfile,
    isLoadingPerformance,
    isUpdating,
    fetchProfile,
    fetchPerformance,
    saveProfile,
  };
};