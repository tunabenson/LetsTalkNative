// PopupMenuContext.js
import React, { createContext, useContext, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Alert } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Option from '../components/utility/Option';
import MoreInfoPopup from '../components/utility/Option';
import { deletePost, editPost, fetchLikeDislikeCounts } from '../api/firebaseUtils';
import Toast from 'react-native-toast-message';
import ReportModal from '../components/utility/ReportModal';
import PopupMenu from '../components/posts/subcomponents/popupMenu/PopupMenu';
// import PopupMenu from '../components/posts/subcomponents/popupMenu/PopupMenu';


const PopupMenuContext = createContext();

export const usePopupMenu = () => useContext(PopupMenuContext);

export const PopupMenuProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupData, setPopupData] = useState({});


  const showPopup = (data) => {
    setPopupData(data);
    setIsVisible(true);
  };

  const hidePopup = () => {
    setIsVisible(false);
  };

 
  return (
    <PopupMenuContext.Provider value={{ showPopup, hidePopup, popupData, isVisible }}>
      {children}
{isVisible&&(<PopupMenu  popupData={popupData} hidePopup={hidePopup} />)}
    </PopupMenuContext.Provider>
  );
};
