// hooks/useLogin.js
import { useState } from 'react';
import { signInWithEmailAndPassword, signOut, updateCurrentUser, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../api/firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const useLogin = (navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [pressedLogin, setPressedLogin] = useState(false);

  const showAlert = (type,title, message) => {
    Toast.show({
      type:type,
      text1:title,
      text2:message,
  
    })
  };

  const setURLForProfile=async(user)=>{
    try {
      let url= await getDownloadURL(ref(storage, `profilepic/${user.displayName}_200x200.jpg`));
      let miniUrl= await getDownloadURL(ref(storage, `profilepic/${user.displayName}_50x50.jpg`));
      console.log(url);
      console.log(miniUrl);
      if(url){
      console.log('in')
      await updateDoc(doc(db,'users', user.uid), {url:url, miniUrl:miniUrl});
      await updateProfile(user,{photoURL:url});
      }
      else{
        updateProfile(user,{photoURL:'empty'});

      }
    } catch (error) {
      console.log(error.message);
    }
  }
  



  const handleLogin = async () => {
    setPressedLogin(true); // Show the spinner

    try {
      if (!username.trim() || !password.trim()) {
        showAlert('error','Error', 'You left one or more fields blank');
        setPressedLogin(false);
        return;
      }
      if (!username.includes('@')) {
        showAlert('error','Error', 'Please Enter a valid Email Address');
        setPressedLogin(false);
        return;
      }

      await signInWithEmailAndPassword(auth, username, password)
        .then(userCredentials => {
          userCredentials.user.reload();
          if (!userCredentials.user.emailVerified) {
            signOut(auth); 
            showAlert('info',"Action Required", "Please Verify Email before logging on");
            return;
          } else {
            if(!userCredentials.user.photoURL){
              setURLForProfile(userCredentials.user);
            }
            navigation.reset({
              index: 0,
              routes: [{ name: 'HomePage' }],
            });
            setUsername(undefined);
            setPassword(undefined);
          }
        });
    } catch (e) {
      let msg = e.message;
      if (msg.includes('auth/invalid-email')) { showAlert('error','Error', 'Account Does Not Exist'); }
      if (msg.includes('auth/invalid-credential')) { showAlert('error','Error', 'Invalid Email or Password'); }
    } finally {
      setPressedLogin(false); // Hide the spinner regardless of outcome
    }
  };

  return { username, setUsername, password, setPassword, hiddenPassword, setHiddenPassword, pressedLogin, handleLogin };
};

export default useLogin;
