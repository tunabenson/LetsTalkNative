// SignUpStepThree.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useSignUpStepThree from '../../../hooks/auth-flow/useStageThree';

const SignUpStepThree = ({ navigation, route }) => {
  const { bio, setBio, profilePicture, setProfilePicture, isSubmitted, selectImage, loadDataToUser } = useSignUpStepThree(navigation, route);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View className="flex-1 justify-center items-center bg-primarycolor-4 p-4">
        <Text style={{ fontFamily: 'Amiri' }} className="text-white text-3xl mb-8 font-semibold">Add Profile Picture and Bio</Text>
        <TouchableOpacity onPress={selectImage} className="mb-4">
          {profilePicture ? (
            <Image source={{ uri: profilePicture.uri }} className="w-32 h-32 rounded-full" />
          ) : (
            <View className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <FontAwesome name="camera" size={32} color="white" />
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          className="w-64 p-3 mb-4 border border-gray-300 rounded-2xl bg-white text-black"
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          blurOnSubmit={true}
        />
        {isSubmitted ?
          <ActivityIndicator size="small" color={'#ffffff'} />
          :
          <TouchableOpacity
            className="w-full p-4 rounded-2xl bg-white text-primarycolor-4 items-center"
            onPress={loadDataToUser}
          >
            <Text style={{ fontFamily: 'Amiri' }} className="text-primarycolor-4">Sign Up</Text>
          </TouchableOpacity>
        }
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpStepThree;
