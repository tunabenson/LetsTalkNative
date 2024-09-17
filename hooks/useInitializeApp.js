// hooks/useInitializeApp.js
import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

const useInitializeApp = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [authChecked, setAuthIsChecked] = useState(false);
  const [loaded, error] = useFonts({
    'Amiri': require('../assets/fonts/Exo/ExoRegular.ttf'),
  });



  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log('started process')
        onAuthStateChanged(auth, (user) => {
          console.log('mouted')
          if (user && auth.currentUser.emailVerified) {
            setSignedIn(true);
          } else {
            setSignedIn(false);
          }
          setAuthIsChecked(true);
        });
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if ( authChecked && (loaded || error)) {
      await SplashScreen.hideAsync();
    }
  }, [authChecked, loaded, error]);

  return { signedIn, authChecked, loaded,error, onLayoutRootView };
};

export default useInitializeApp;
