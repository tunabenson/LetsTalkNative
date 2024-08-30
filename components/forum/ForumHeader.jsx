import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { AntDesign, Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MoreInfoForumPopup from '../utility/MoreInfoForumPopup';

function ForumHeader({ forumDescription,photoUrl }) {
  const [moreInfo, toggleMoreInfo]=useState(false);

  const navigation=useNavigation();
  return (
    <View className='bg-blue-600 p-2 flex-row justify-between items-center'>
       <TouchableOpacity
          className="mr-5"
          onPress={() => navigation.navigate('HomeScreen')}
          hitSlop={30}
        >
        <AntDesign name="arrowleft" size={25} color="white" />

        </TouchableOpacity>
      <View  className='flex-row items-center '>
     

       {photoUrl?( <Image
          source={{ uri: photoUrl }}
          className='h-16 w-16 rounded-full mr-2'
        />):(<View className="relative w-16 h-16 overflow-visible">
          <Octicons
            name="comment-discussion"
            size={55}
            color="white"
            style={{ position: 'absolute', top: '40%', left: '20%', transform: [{ translateX: -22 }, { translateY: -20 }] }}
          />
        </View>)}
        <View className='w-10/12' >
          <Text  className='text-white text-xl font-bold'>{`#${forumDescription.name.toUpperCase()}`}</Text>
          <Text  className='text-white text-sm w-3/4 '>{forumDescription.description}</Text>
        </View>
      </View>
      <TouchableOpacity hitSlop={25} onPress={()=>toggleMoreInfo(true)} className='absolute right-8'>
        <AntDesign name="infocirlceo" size={24} color="white" />
      </TouchableOpacity>
      {moreInfo && (<MoreInfoForumPopup forum={forumDescription} onClose={()=>toggleMoreInfo(false)}/>)}
    </View>

    
  );
}
export default ForumHeader;
