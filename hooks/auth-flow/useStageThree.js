// useSignUpStepThree.js
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from 'firebase/auth';
import { setDoc, Timestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import Toast from 'react-native-toast-message';
import { storage,auth, db} from '../../api/firebaseConfig';

const useSignUpStepThree = (navigation, route) => {
  const { email, username, password, selectedForums } = route.params;
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);



  const selectImage = async () => {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
      base64: true
    });
    if (!response.canceled) {
      setProfilePicture(response.assets[0]);
    }
  };

  const loadImagetoUser = async () => {
    try {
      if (profilePicture) {
        const { uri } = await FileSystem.getInfoAsync(profilePicture.uri);

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = (e) => reject(new TypeError('Network request failed'));
          xhr.responseType = 'blob';
          xhr.open('GET', uri);
          xhr.send(null);
        });
        const save = ref(storage, `profilepic/${auth.currentUser.displayName}.jpg`);
        await uploadBytes(save, blob);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload profile picture.'
      });
    }
  };

  const loadDataToUser = async () => {
    try {
      Keyboard.dismiss();
      setIsSubmitted(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);
      await setDoc(doc(db, 'users', user.uid), {
        username,
        joinDate: Timestamp.now(),
        interests: selectedForums,
        bio,
        url: " "
      });
      await loadImagetoUser();
      await signOut(auth);
      navigation.navigate("LoginPage");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'There was an error during the sign-up process. Please try again.'
      });
    }
  };

  return {
    bio,
    setBio,
    profilePicture,
    setProfilePicture,
    isSubmitted,
    selectImage,
    loadDataToUser
  };
};

export default useSignUpStepThree;
