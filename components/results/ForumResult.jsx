import React from 'react';
import {  Text, Image, TouchableOpacity, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';

const ForumResult = ({ item, navigation, handler, small,disabled}) => {

  return (
    <View>
    <TouchableOpacity className="flex-row items-center p-2 mr-3 ml-3 border-2 bg-white border-gray-300"  
    disabled={disabled}
    onPress={()=>{
        if(!navigation){
            handler(item.name);
        }
        else{
         navigation.navigate('Forum', {forumname:item.name})
        }
        }}>
          <>

  
{!small?(<>
  <View className="relative w-16 h-16 rounded-full border-2 border-black overflow-visible">
      <Octicons
        name="comment-discussion"
        size={44}
        color="black"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -22 }, { translateY: -20 }] }}
      />
    </View>
    <View>
      <Text style={{fontFamily:'Amiri'}} className="pl-4 text-lg font-semibold text-black">#{item.name?.toUpperCase()}</Text>
      <Text style={{fontFamily:'Amiri'}} className="pl-4 text-md font-semibold text-black">{`${item.description?.substring(0, 50)}...`}</Text>
    </View></>):(<>
  <View className="relative w-10 h-10 rounded-full border-2 border-black overflow-visible">
      <Octicons
        name="comment-discussion"
        size={27}
        color="black"
        style={{ position: 'absolute', top: '69%', left: '73%', transform: [{ translateX: -22 }, { translateY: -20 }] }}
      />
    </View>
    <View className='w-11/12'>
      <Text style={{fontFamily:'Amiri'}} className="pl-4 text-md font-semibold text-black">#{item.name?.toUpperCase()}</Text>
      <Text style={{fontFamily:'Amiri'}} className="pl-4 text-md font-semibold text-black">{`${item.description?.substring(0, 50)}...`}</Text>
    </View></>)}
    </>
    </TouchableOpacity>
    </View>
  );
  
};

export default ForumResult;
