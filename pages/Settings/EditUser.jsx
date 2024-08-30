import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ImagePicker } from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../api/firebaseConfig';
import * as FileSystem from 'expo-file-system'
import { ref, uploadBytes } from 'firebase/storage';
import Toast from 'react-native-toast-message';
function EditUser({navigation , route}) {
    const {currentBio, photoUrl}=route.params;
  const [bio, setBio] = useState(currentBio);
  const [profilePic, setProfilePic] = useState(photoUrl);
  const [submitted, setSubmitted]=useState(false); 
  const handleProfilePictureChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri);
    }
  };


  const handleSubmit=async()=>{
    if(bio!==currentBio){
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {bio:bio});
    }
    if(profilePic!==photoUrl){
        auth.currentUser.photoURL=undefined;
        try {
                const {uri}= await FileSystem.getInfoAsync(profilePic);
                const blob= await new Promise((resolve, reject)=>{
                  const xhr= new XMLHttpRequest();
                  xhr.onload=()=>{
                    resolve(xhr.response);
                  }
                  xhr.onerror=(e)=>{
                    reject(new TypeError('Network request failed'))
                  }
                  xhr.responseType='blob';
                  xhr.open('GET', uri);
                  xhr.send(null);
                });
                const save=ref(storage,  `profilepic/${auth.currentUser.displayName}.jpg`);
                await uploadBytes(save, blob);
                Toast.show({type:'success', text1:"Update Sucessful", text2: "Please log out and log back in to see results"})
            } catch (error) {   
            }
    }
  }

  return (
    <View className='flex-1 p-5 bg-primarycolor-4 items-center'>
      <Text style={{fontFamily:'Amiri'}} className='text-3xl font-bold mb-2 text-white mt-5 self-start ml-8'>Bio:</Text>
      <TextInput
        style={{fontFamily:'Amiri', fontSize:18}}
        className='border border-gray-300 p-4 m-4 w-11/12 h-1/4 bg-white rounded-2xl'
        onChangeText={setBio}
        value={bio}
        textAlignVertical='top'
        multiline
        placeholder="Describe yourself"
        blurOnSubmit={true} 
      />
      <Text style={{fontFamily:'Amiri'}}  className='text-2xl font-bold mb-2 text-white'>Profile Picture:</Text>
      <TouchableOpacity onPress={handleProfilePictureChange} className="mb-4">
          {profilePic ? (
            <Image source={{ uri: profilePic }} className="w-32 h-32 rounded-full" />
          ) : (
            <View className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <FontAwesome name="camera" size={32} color="white" />
            </View>
          )}
        </TouchableOpacity>
        {!submitted?(<TouchableOpacity
        className='bg-white flex-row rounded-2xl m-24 w-1/2'
        
          onPress={() =>{handleSubmit()}}
        >
            <Text  style={{fontFamily:'Amiri'}} className='text-lg font-bold text-black m-3 ml-9'>Submit Changes</Text>
        </TouchableOpacity>):(<ActivityIndicator style={{marginTop:80}} color={'white'} size={20} />)}
    </View>
  );
}

export default EditUser;
