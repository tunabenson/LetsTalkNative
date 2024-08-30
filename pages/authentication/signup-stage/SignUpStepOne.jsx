import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useStageOne } from '../../../hooks/auth-flow/useStageOne';


const SignUpStepOne = ({ navigation }) => {
   const{email, 
    username, 
    password,
    confirmPassword,
    hiddenPassword,
    isLoading,
    setUsername ,
    setEmail ,
    setPassword ,
    setConfirmPassword , 
    setHiddenPassword ,
    handleNext}=useStageOne(navigation);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-primarycolor-4 p-4">
        <Text style={{fontFamily:'Amiri'}} className="text-white text-3xl mb-15 font-semibold">Sign Up</Text>
        <TextInput
          className="w-64 p-3 mb-3 mt-5 border border-gray-300 rounded-2xl bg-white text-black"
          hitSlop={15}
          placeholder="Email"
          keyboardType='email-address'
          value={email}
          autoCorrect={false}
          onSubmitEditing={() => Keyboard.dismiss()}
          inputMode='email'
          autoComplete='email'
          onChangeText={(newText) => setEmail(newText)}
        />
        <TextInput
          className="w-64 p-3 mb-3 border border-gray-300 rounded-2xl bg-white text-black"
          hitSlop={15}
          placeholder="Username"
          keyboardType='ascii-capable'
          value={username}
          autoCorrect={false}
          autoComplete='username-new'
          onChangeText={(newText) => setUsername(newText.replace(/ /g, ''))}
        />
        <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded-2xl bg-white">
          <TextInput
            hitSlop={15}
            className="flex-1 text-black"
            placeholder="Password"
            keyboardType='ascii-capable'
            value={password}
            autoCorrect={false}
            onChangeText={(newText) => setPassword(newText.replace(/ /g, ''))}
            secureTextEntry={hiddenPassword}
          />
          <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={10}>
            <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center w-64 p-3 mb-4 border border-gray-300 rounded-2xl bg-white">
          <TextInput
            className="flex-1 text-black"
            placeholder="Confirm Password"
            keyboardType='ascii-capable'
            value={confirmPassword}
            onChangeText={(newText) => setConfirmPassword(newText.replace(/ /g, ''))}
            secureTextEntry={hiddenPassword}
          />
          <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)} className="ml-2" hitSlop={5}>
            <FontAwesome name={hiddenPassword ? 'eye-slash' : 'eye'} size={18} color={'black'} />
          </TouchableOpacity>
        </View>
        {isLoading ?
          <ActivityIndicator size="small" color={'#ffffff'} />
          :
          <TouchableOpacity
            hitSlop={15}
            className="w-64 p-4 bg-white items-center rounded-2xl"
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={{fontFamily:'Amiri'}} className="text-primarycolor-4 font-bold">Next</Text>
          </TouchableOpacity>
        }
         <Pressable className='mt-10 mb-5 font-semibold' hitSlop={20} onPress={() => navigation.navigate('LoginPage')}>
          <Text style={{fontFamily:'Amiri'}} className='font-bold text-black'>Already Have an Account? Sign In Here!</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpStepOne;
