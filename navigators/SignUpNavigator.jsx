import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpStepOne from '../pages/authentication/signup-stage/SignUpStepOne'
import SignUpStepTwo from '../pages/authentication/signup-stage/SignUpStepTwo'
import SignUpStepThree from '../pages/authentication/signup-stage/SignUpStepThree'
const Stack = createStackNavigator();

const SignUpNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUpPage1" component={SignUpStepOne} />
      <Stack.Screen name="SignUpPage2" component={SignUpStepTwo} />
      <Stack.Screen name="SignUpPage3" component={SignUpStepThree} />
    </Stack.Navigator>
  );
};

export default SignUpNavigator;
