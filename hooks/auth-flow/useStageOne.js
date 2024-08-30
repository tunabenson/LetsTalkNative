import { useState } from "react";
import { getUsernameAndEmailAvailability } from "../../api/firebaseUtils";
import { Keyboard } from "react-native";
import Toast from 'react-native-toast-message';

export function useStageOne(navigation) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type, title, message) => {
    Toast.show({
      type: type, // 'success' or 'error'
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
      onShow: () => {},
      onHide: () => {} // Called when Toast hides (default fadeOut animation)
    });
  };

  const checkInputsValid = async () => {
    try {
      console.log(email, username);
      const availability = await getUsernameAndEmailAvailability(email, username);
      if (availability.usernameExists) {
        showToast('error', 'Error', 'Username Taken');
        return false;
      }
      if (availability.emailExists) {
        showToast('error', 'Error', 'Email is already in use');
        return false;
      }
      return true;
    } catch (error) {
      showToast('error', 'Error', 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    Keyboard.dismiss();
    if (!email || !username || !password || !confirmPassword) {
      showToast('error', 'Error', 'Please fill all fields');
      return;
    }
    if(!email.includes('@')){
      showToast('error', 'Error', 'Please Enter a valid Email')
    }
    if (password !== confirmPassword) {
      showToast('error', 'Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      showToast('error', 'Error', 'Password must be longer than 6 characters');
      return;
    }
    setIsLoading(true);
    const valid = await checkInputsValid();
    if (valid) {
      navigation.navigate('SignUpPage2', { email, username, password });
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }
    setIsLoading(false);
  };

  return { email, username, password, confirmPassword, hiddenPassword, isLoading, setUsername, setEmail, setPassword, setConfirmPassword, setHiddenPassword, handleNext };
}
