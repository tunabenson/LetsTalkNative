import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


const Stack= createStackNavigator();
function Reply({item, onPress}) {
  const nav= useNavigation();
    return (
    
      <TouchableOpacity
        className="w-24 ml-2 items-center p-1 bg-gray-200 rounded-lg shadow-md"
        onPress={() => {if(onPress){
            onPress(item)
        }
          nav.navigate('reply-page', {item})
        }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <View className="flex-row items-center">
          <FontAwesome name="reply" size={24} color="black" />
          <Text style={{fontFamily:'Amiri'}} className="ml-2 text-2xl font-bold">Reply</Text>
        </View>
      </TouchableOpacity>

  );


}

export default Reply;
