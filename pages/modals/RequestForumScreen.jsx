import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db, storage } from '../../api/firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import { getForumAvailability } from '../../api/firebaseUtils';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';

function RequestForumScreen({ navigation }) {
  const [forumName, setForumName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted]=useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };




  const onSubmit= async ()=>{
      try {
        setSubmitted(true);
        if(image){
          const {uri}= await FileSystem.getInfoAsync(image);
    
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
          const save=ref(storage,  `requests/${forumName}.jpg`);
          await uploadBytes(save, blob);
        }
      }catch(error){
        console.error(error.message);
      }

      const response= await getForumAvailability({forumName})
      Toast.show({ type:response.message.toLowerCase(),text1:response.message,text2:response.content,text2Style:{flexWrap:'wrap', lineHeight:15}})
      if(response.message==='Success'){
      navigation.goBack();
      addDoc(collection(db, 'requests'), {
        forumName, 
        description,
        date:Timestamp.now(),
        author:auth.currentUser.displayName
      });

    }
  }


  return (
    <ScrollView className="flex-1 bg-primarycolor-4 p-4">
      <View className="mb-4 mt-6">
        <Pressable hitSlop={20} onPress={() => navigation.goBack()} className="mb-3">
          <AntDesign name="arrowleft" size={20} color="white" />
        </Pressable>

        <Text style={{ fontFamily: 'Amiri' }} className="text-white text-2xl font-semibold mb-4">
          Create a Forum
        </Text>

        <KeyboardAvoidingView className=" p-4 rounded-2xl mb-4 ">
          <TextInput
            value={forumName}
            onChangeText={(text)=>setForumName(text.replace(/ /g, "_"))}
            placeholder="Forum Name..."
            className="text-black h-12 bg-white rounded-2xl pl-4 "
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description..."
            multiline
            numberOfLines={4}
            className="text-black h-32 mt-4 bg-white rounded-2xl p-4"
          />
        </KeyboardAvoidingView>

        <TouchableOpacity onPress={pickImage} className="bg-white p-4 rounded-lg mb-4 items-center">
          <Text style={{ fontFamily: 'Amiri' }} className="text-primarycolor-4 font-bold">
            Select an Image
          </Text>
        </TouchableOpacity>

        {image && (
          <View className="bg-white p-1 rounded-2xl mb-4">
            <Image source={{ uri: image }} className="w-full h-48 rounded-lg" />
          </View>
        )}

       {!submitted?( <TouchableOpacity className="bg-white p-4 rounded-lg items-center" onPress={onSubmit}>
          <Text style={{ fontFamily: 'Amiri' }} className="text-primarycolor-4 font-bold">
            Submit Forum
          </Text>
        </TouchableOpacity>):(<ActivityIndicator color={'white'} size={15}></ActivityIndicator>)}
      </View>
    </ScrollView>
  );
}

export default RequestForumScreen;
