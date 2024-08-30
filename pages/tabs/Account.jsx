import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Platform, TouchableOpacity } from 'react-native';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db, userBlurhash } from '../../api/firebaseConfig';
import Post from '../../components/posts/Post';
import { createStackNavigator } from '@react-navigation/stack';
import { FullPostScreen } from '../ExpandedPosts/FullPostScreen';
import LoadingPage from '../LoadingPage';
import SettingsPage from '../Settings/SettingsPage';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import useAccount from '../../hooks/useAccount';
import PlatformDependantExit from '../../components/utility/PlatformDependantExit';
import SettingsNavigator from '../../navigators/AccountNavigator';
const fetchPostsByUsername = async (username) => {
  const postsQuery = query(collection(db, "posts"), where('username', '==', username), orderBy("date", 'desc'), limit(15));
  const snap = await getDocs(postsQuery);
  const temp = [];

  for (const document of snap.docs) {
    const postData = { ...document.data(), id: document.id, path: document.ref.path };
    temp.push(postData);
  }

  return temp;
};

const Stack = createStackNavigator();

const Account = ({ route, navigation }) => {
  const { username } = route.params;
  console.log(username)
  const {account, fetchMoreUserPosts, posts}=useAccount(username); 


  if (!account || !posts) {
    return <LoadingPage />;
  }
  
  return (
    <View className="flex-1 bg-primarycolor-4 p-4">
      <PlatformDependantExit navigation={navigation}/>

      <View className="flex-row items-center mb-4 mt-7">
        {account.url !== ' ' ?(<Image
          className="w-24 h-24  bg-slate-400 rounded-full border-4 border-white"
          source={{ uri: account.url }}
          placeholder={{blurhash: userBlurhash}}
        />):(<View className="relative w-24 h-24 bg-white rounded-full  border-white">
          <MaterialIcons name="account-circle" size={100} color="#4D5057"     style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] }}
 />
        </View>)}
        <View className="flex-1 ml-4  bg-white p-4 rounded-lg shadow-md">
          <Text style={{fontFamily:'Amiri'}} className="text-2xl font-bold mb-1">{username}</Text>
          <Text style={{fontFamily:'Amiri'}} className="text-gray-700 mb-1">{account.bio}</Text>
          <Text style={{fontFamily:'Amiri'}} className="text-gray-500">{new Date(account.joinDate.seconds * 1000).toLocaleDateString("en-US")}</Text>
          {username === auth.currentUser.displayName && (
            <Pressable
              className="absolute right-2 top-2 mb-3"
              onPress={() => navigation.navigate('Settings', {currentBio: account.bio, photoUrl: account.url})}
              hitSlop={20}
            >
            <FontAwesome name='gear' size={25} color='gray' />
            </Pressable>
          )}
          <Text style={{fontFamily:'Amiri'}} className='text-gray-700 pt-3 font-medium flex-col'>Achievements: </Text>
        </View>
      </View>
      <View className="flex-1 bg-primarycolor-4 border-cyan-400">
        <Text style={{fontFamily:'Amiri'}} className="text-white text-2xl mt-4 font-bold">Recent Posts</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post item={item} fromAccount={true} navigation={navigation} />}
          onEndReached={()=>{}}
          onEndReachedThreshold={0.6}
          keyExtractor={(item,index) => index.toString()}
          ListEmptyComponent={(<View className='mt-36'></View>)}
        />
      </View>
    </View>
  );
};


export default Account;
