import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import Toast from 'react-native-toast-message';
import { db } from "../../api/firebaseConfig";

export function useStageTwo(navigation, route) {
  const [selectedForums, setSelectedForums] = useState([]);
  const { email, username, password } = route.params;
  const [forums, setForums]=useState([]);

  const getForums=async()=>{
    const snapshot= await getDoc(doc(db,'appdata/interests'));
    
    setForums(snapshot.data().interests);
  }
  useEffect(()=>{
    getForums();
  },[]);
 
  const toggleForumSelection = (forum) => {
    setSelectedForums((prev) =>
      prev.includes(forum) ? prev.filter((f) => f !== forum) : [...prev, forum]
    );
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type: type, // 'success' or 'error'
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
      onShow: () => {},
      onHide: () => {}
    });
  };

  const onNext = () => {
    if (selectedForums.length < 3) {
      showToast('error', 'Error', 'Please select at least 3 interests');
      return;
    }
    Keyboard.dismiss();
    navigation.navigate('SignUpPage3', { email, username, password, selectedForums });
  };

  return { selectedForums, forums, setSelectedForums, toggleForumSelection, onNext };
}
