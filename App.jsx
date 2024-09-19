import React from 'react';
import {  View } from 'react-native';
import useInitializeApp from './hooks/useInitializeApp';
import Toast from 'react-native-toast-message';
import { PopupMenuProvider } from './contexts/PopupMenuContext';
import AppNavigator from './navigators/AppNavigator';
 

export default function App() {

  const { signedIn, authChecked, loaded, error, onLayoutRootView } = useInitializeApp();

  if (!authChecked || (!loaded && !error)) {
    return null; 
  }
  console.log=()=>{}
  console.warn=()=>{}
  return (
  <View onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: 'black' }}>   
    <PopupMenuProvider>
        <AppNavigator signedIn={signedIn}/>
    </PopupMenuProvider>
        <Toast />
    </View>
  );
}
