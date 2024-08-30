import React from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import BiasBar from '../posts/subcomponents/BiasBar'
import { getCompletePostFromSearch } from '../../api/firebaseUtils';

function PostResult(props) {
    const item=props.item;
    const onPressHandler=async()=>{
      const fullItem= await getCompletePostFromSearch(item);
      props.navigation.navigate('Post', { item:fullItem})
    }


  return (
        <TouchableOpacity
          disabled={props?.disabled}
          className="m-2 p-4 bg-white border border-primarycolor-4 rounded-lg shadow-lg"
          onPress={onPressHandler}
          activeOpacity={0.7}
        >
        
            <View className="flex-shrink-0">
              <Pressable
                hitSlop={10}
                className="w-48"
                disabled={props?.disabled}
                onPress={() => props.navigation.navigate('account-page', {username: item.username })}
              >
                <Text style={{fontFamily:'Amiri'}} className="text-lg font-semibold text-amber-700">@{item.username}</Text>
              </Pressable>
            </View>
          <Text style={{fontFamily:'Amiri'}} className="absolute top-5 right-4 text-base font-bold text-black">~{item?.forum?.toUpperCase()}</Text>
          <Text style={{fontFamily:'Amiri'}} className="text-base text-gray-800 pb-2 mt-5">{item?.text}</Text>     
            {item.biasEvaluation && 
            <BiasBar className="absolute right-3 bottom-6 " biasEvaluation={item.biasEvaluation} />
        
          }   
        </TouchableOpacity>
  )
}

export default PostResult