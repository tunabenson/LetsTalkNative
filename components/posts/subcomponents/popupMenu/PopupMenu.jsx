import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Alert } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Option from '../../../utility/Option';
import MoreInfoPopup from './MoreInfoPopup';
import { deletePost, editPost, fetchLikeDislikeCounts } from '../../../../api/firebaseUtils';
import Toast from 'react-native-toast-message';
import ReportModal from '../../../utility/ReportModal';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../../../api/firebaseConfig';



function PopupMenu({ popupData ,hidePopup}) {
  // const { popupData, hidePopup }=usePopupMenu();
  const [visible, setVisible] = useState(true);
  const [reportToggled, setReportToggled]= useState(false); 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState(popupData.text);
  const [playAnimationReport, setPlayAnimationReport] = useState(false);
  const [infoScreenVisible, setInfoScreenVisible] = useState(false);
  const [infoScreenConfig, setInfoScreenConfig] = useState();

  const handleClose = () => {
    hidePopup();
  };

  const reportPost=async()=>{
    setReportToggled(true);
    setVisible(false);
  }


  const reportPostHandler = async (data) => {
    setReportToggled(false);
    setPlayAnimationReport(true);
    setTimeout(()=>{setPlayAnimationReport(false);
      hidePopup();
    },2000)
    addDoc(collection(db, 'reports' ), {...data, user: auth.currentUser.displayName, referringTo:popupData.path}).then(()=> {
      
      Toast.show({
        type: 'info',
        text1: 'Report submitted',
      });
    });
  };


  const saveEdit = async () => {
    if (!editText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Post content cannot be empty.'
      });
      return;
    }

    try {
      hidePopup();
      await editPost({ text: editText, path:popupData.path, forum:popupData.forum });
      Toast.show({
        type: 'success',
        text1: 'Post Updated',
        text2: 'Your post has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating post:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'There was an error updating your post. Please try again.'
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            hidePopup();
            try {
              await deletePost({path:popupData.path});
              Toast.show({
                type: 'success',
                text1: 'Post deleted successfully'
              });
            } catch (error) {
              console.error('Error deleting post:', error);
              Toast.show({
                type: 'error',
                text1: 'Deletion failed',
                text2: 'Please try again later.'
              });
            }
          }
        }
      ]
    );
  };

  const handleMoreInfo = async () => {
    setVisible(false);
    const data = await fetchLikeDislikeCounts(popupData.path);

    setInfoScreenConfig({
      likes: data.likes,
      dislikes: data.dislikes,
      author: popupData.author,
      editDate: popupData.editDate
    });
    setInfoScreenVisible(true);
  };

  return (
    <View>
<Modal
        visible={visible}
        transparent={true}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={hidePopup}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0000004d' }}>
              <View className="bg-white p-4 rounded-lg w-11/12 mb-2">
                {!playAnimationReport ? (
                  <View>
                    {popupData.isOwner && (
                      <View>
                        <Option style='p-2 flex-row'
                         handler={()=>{setVisible(false);setEditModalVisible(true)}}
                        icon={<FontAwesome5 name="edit" size={24} color="blue" />}
                        text='Edit Post'
                        textStyle='text-blue-600 text-xl font-semibold ml-2'
                        />

                        <Option style='p-2 mt-2 flex-row'
                         handler={()=>handleDelete()}
                        icon={<FontAwesome5 name="trash" size={24} color="red" />}
                        text='Delete Post'
                        textStyle='text-red-600 text-xl font-semibold ml-2'
                        />
                      </View>
                    )}
                      <Option style='p-2 mt-2 flex-row'
                         handler={()=>reportPost()}
                        icon={<FontAwesome5 name="flag" size={24} color="red" />}
                        text='Report Post'
                        textStyle='text-red-600 text-xl font-semibold ml-2'
                    />
                    <Option style='p-2 mt-2 flex-row'
                         handler={()=>handleMoreInfo()}
                        icon={<FontAwesome name="info-circle" size={24} color="#4D5057" />}
                        text='More Information'
                        textStyle='text-gray-500 text-xl font-semibold ml-2'
                    />

                    <Option style='p-2 mt-1 flex-row'
                         handler={()=>handleClose()}
                        icon={<FontAwesome name="close" size={24} color="#4D5057" />}
                        text='Cancel'
                        textStyle='text-gray-600 text-xl font-semibold ml-2'
                      />
                  </View>
                ) : (
                  <LottieView
                    autoPlay={true}
                    source={require('../../../../assets/animations/reportAnimation.json')}
                    loop={false}
                    style={{ width: 150, height: 150, alignSelf: 'center' }}
                  />
                )}
              </View>
            </View >
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={editModalVisible}
        animationType='slide'
        onRequestClose={() => hidePopup()}
      >
        <TouchableWithoutFeedback onPress={() => hidePopup()}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0000004d' }}>
              <View className="bg-white p-4 rounded-lg w-11/12 mb-2">
              <TextInput
                value={editText}
                onChangeText={(text) => setEditText(text)}
                placeholder="Edit your post"
                className="border border-gray-300 rounded-md p-2 mb-4"
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity onPress={saveEdit} className="bg-blue-500 rounded-md p-2">
                <Text style={{fontFamily:'Amiri'}} className="text-center text-black font-medium">Save</Text>
              </TouchableOpacity>
              {/** TODO: add posting animation */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


{infoScreenConfig && (<MoreInfoPopup infoScreenConfig={infoScreenConfig} onClose={hidePopup} infoScreenVisible={infoScreenVisible}/>)}
 {reportToggled && (<ReportModal close={hidePopup} submitHandler={(data)=>reportPostHandler(data)}/>)}
   </View>
  );
}

export default PopupMenu;
