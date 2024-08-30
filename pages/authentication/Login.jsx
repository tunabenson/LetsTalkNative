// LoginPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useLogin from '../../hooks/useLogin';
import { Image } from 'expo-image';

const LoginPage = ({ navigation }) => {

  const {
    username,
    setUsername,
    password,
    setPassword,
    hiddenPassword,
    setHiddenPassword,
    pressedLogin,
    handleLogin
  } = useLogin( navigation);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-primarycolor-4 p-10">
        <Text style={{fontFamily:'Amiri'}} className="text-white text-4xl mb-8 font-semibold">Login</Text>
        <TextInput
          hitSlop={20}
          textContentType='countryName' 
          className="w-64 p-3 mb-3 border border-gray-300 rounded-2xl text-blackraisin-100 bg-white"
          onSubmitEditing={Keyboard.dismiss}
          placeholder="Email"
          value={username}
          autoCapitalize='none'
          onChangeText={newText => setUsername(newText.replace(/ /g, '').toLowerCase())}
          keyboardType='email-address'
        />
        <View className="flex flex-row items-center w-64 p-3 mb-4 border rounded-2xl border-gray-300 bg-white">
          <TextInput
            hitSlop={20}
            textContentType='addressCity' 
            className="flex-1 text-blackraisin-100 bg-white"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="Password"
            value={password}
            onChangeText={newText => setPassword(newText.replace(/ /g, ''))}
            secureTextEntry={hiddenPassword}
          />
          <Pressable onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={20}>
            <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
          </Pressable>
        </View>
        {pressedLogin ?
          <ActivityIndicator size="small" color={'#ffffff'} />
          :
          <TouchableOpacity
            hitSlop={15}
            className="w-64 p-4 rounded-2xl bg-white items-center"
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text style={{fontFamily:'Amiri'}} className="text-primarycolor-4 font-bold">Login</Text>
          </TouchableOpacity>
        }
        <Pressable className='mt-10 mb-5 font-semibold' hitSlop={20} onPress={() => navigation.navigate('SignUpPage')}>
          <Text style={{fontFamily:'Amiri'}} className='font-bold text-black'> Don't Have an Account? Sign Up Now!</Text>
        </Pressable>
        <Pressable className='mt-10 font-semibold' hitSlop={20} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={{fontFamily:'Amiri'}} className='font-bold text-black'>Forgot Password?</Text>
        </Pressable>
      </View>

    </KeyboardAvoidingView>
  );
};

export default LoginPage;
