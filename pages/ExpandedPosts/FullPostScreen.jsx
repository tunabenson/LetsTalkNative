import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react'
import {  Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Post from '../../components/posts/Post'
import { FlatList } from 'react-native-gesture-handler';
import { getResponse } from '../../api/firebaseUtils';
import Carousel from 'react-native-reanimated-carousel';
import { useConversation } from '../../hooks/useConversation';
import Seperator from '../../components/utility/Seperator';
import { FlashList } from '@shopify/flash-list';

export const FullPostScreen = ({ route, navigation }) => {
    // const [responses, setResponses]=useState([]);
    const {getChildrenPosts, getMorePosts,mainPost, responses, toggleMainPost}=useConversation(route.params.item);
    const depth=useRef(0);
    const position = useRef(new Animated.Value(route.params?.yValue || 30 )).current; // Starting at 0
    useEffect(() => {
      console.log(depth)
      depth.current=depth.current+1
      position.setValue(150);
      Animated.spring(position, {
        stiffness:70,
        toValue: 20, 
        useNativeDriver: true
      }).start();

    }, [mainPost]);
    return (
      <View className="flex-1 bg-primarycolor-4 pt-10">
        <TouchableOpacity
          className="absolute top-8 left-2  p-4"
          onPress={() => navigation.goBack()}
          hitSlop={30}
        >
        <AntDesign name="arrowleft" size={20} color="white" />

        </TouchableOpacity>



  <Animated.View style={{ transform: [{ translateY: position }], marginTop:10}}>
      <Post item={mainPost} isMainPost={true} navigation={navigation} fullScreen={true}  liked={mainPost.path===route.params.item.path ?mainPost?.liked: undefined} disliked={mainPost.path===route.params.item.path ?mainPost?.disliked: undefined} onPress={(item)=>toggleMainPost(item)} />
    </Animated.View>
      <Text style={{fontFamily: 'Amiri'}} className='text-2xl ml-3 mt-5 text-white'> Replies</Text>
      <Seperator/>
    {responses && (
      <>
      <FlashList
                data={responses}
                renderItem={({item }) => (
                  <Post item={item} navigation={navigation} fullScreen={true} onPress={(item)=>toggleMainPost(item)}/>
                )}
                onEndReached={()=>{{console.log('reached')}}}
                onEndReachedThreshold={0.6}
                estimatedItemSize={139}
              
      />
      </>
    )}    
 
    
 
  </View>
    );
};