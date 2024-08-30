import React, {  useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Pressable } from 'react-native';
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Article from '../../components/posts/subcomponents/Article';
import { ScrollView, Switch, TextInput } from 'react-native-gesture-handler';
import usePostCreation from '../../hooks/usePostCreation';
import usePostResponse from '../../hooks/usePostResponse';
import PostResult from '../../components/results/PostResult';
import ExpandedSearch from '../ExpandedSearch';
import PostCreationPage from './createpost/PostCreationPage';
import WebViewScreen from './createpost/WebViewScreen';
import { useNavigation } from '@react-navigation/native';


const usePostHandler = (navigation, url, replyingTo) => {
  if (replyingTo) {
    return usePostResponse(navigation, url, replyingTo);
  } else {
    return usePostCreation(navigation, url);
  }
};



const CreatePost = ({  replyingTo }) => {
  const nav= useNavigation();
  const [url, setUrl]=useState();
  const handler= usePostHandler(nav, url, replyingTo);
  
  const Stack = createStackNavigator();
  return (
    <View className="flex-auto">
    <Stack.Navigator initialRouteName="postCreation">
      <Stack.Screen name="postCreation" children={(props)=>(<PostCreationPage {...props} replyingTo={replyingTo} handler={handler}/>)} options={{ headerShown: false }} initialParams={{url:''}}/>
      <Stack.Screen name="WebViewScreen" children={(props)=><WebViewScreen  {...props} getUrl={(url)=>setUrl(url)}/>} options={{ title: '' }} />
      <Stack.Screen name="ForumSearch" children={(props)=>(<ExpandedSearch {...props} retrieveValue={(forum)=>{handler.setForum(forum)}}/>)} options={{
        headerShown: false,
        cardStyleInterpolator: ({ current: { progress } }) => {
          const opacity = progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],  // Adjust the middle value to control the speed of fading
            extrapolate: 'clamp',
          });

          return {
            cardStyle: {
              opacity
            }
          };
        }
      }}/>
    </Stack.Navigator>
  </View>
  );
};

export default CreatePost;
