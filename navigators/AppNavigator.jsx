import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'



//Screens
import Home from '../pages/tabs/Home';
import LoginPage from '../pages/authentication/Login';
import ForgotPasswordPage from '../pages/authentication/ForgotPasswordPage';
import CreatePost from '../pages/tabs/CreatePost';
import { FullPostScreen } from '../pages/ExpandedPosts/FullPostScreen';
import ProfilePage from '../pages/tabs/Account';
import RequestForumScreen from '../pages/modals/RequestForumScreen';
import SignUpNavigator from './SignUpNavigator';
import { Image } from 'react-native';

const Stack= createStackNavigator();
function AppNavigator({signedIn}) {
   
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{  title:'',  headerLeft:()=>(<Image style={{width:90, height:90 , marginBottom:20, marginLeft:150}} source={require('../assets/images/adaptiveicon.png')}/>) }}>
      {signedIn ? (
        <>
        <Stack.Screen name='HomePage' component={Home} />
        <Stack.Group screenOptions={{
          presentation: 'modal',
          headerShown:false,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 700,  // Increase the duration for slower animation
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 500,
              },
            },
          },
        }}>
          <Stack.Screen name="reply-page" children={({route}) => (
            <CreatePost replyingTo={route.params.item} />
          )} />
          <Stack.Screen name='account-page' component={ProfilePage} options={{headerShown:false}}/>
          <Stack.Screen name='request-forum-page' component={RequestForumScreen}/>
      </Stack.Group>
      <Stack.Screen
    name="Post"
    component={FullPostScreen}
    options={{
      headerShown: false,
      transitionSpec: {
        open: { animation: 'spring', config: { duration: 100} },
        close: { animation: 'timing', config: { duration: 100 } }
      },
cardStyleInterpolator: ({ current: { progress } }) => {
  return {
    cardStyle: {
      opacity:progress
    }
  };
}
}}

/>
      </>
      ) : (
        <Stack.Group>
          <Stack.Screen name='SignUpPage' component={SignUpNavigator} />
          <Stack.Screen name='LoginPage' component={LoginPage} />
          <Stack.Screen name='ForgotPassword' component={ForgotPasswordPage} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default AppNavigator;