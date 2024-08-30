import React from 'react';
import {  Text,  TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const UserResult = ({ user, navigation}) => {
  return (
    <View>
    <TouchableOpacity className="flex-row items-center p-2 border-b border-gray-300"  onPress={()=>navigation.navigate('account-page', {username:user.username})}>
{user?.miniUrl && user?.miniUrl!==' '?(<Image
      source={{ uri: user.miniUrl }}
      className="w-10 h-10 rounded-full"
      style={{ width: 45, height: 45, borderRadius: 20 }}
    />):(<View className="relative w-12 h-10 rounded-full  overflow-visible">
      <MaterialIcons
        name="account-circle"
        size={50}
        color="#4D5057"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] }}
      />
    </View>
    )}

      
      <Text style={{fontFamily:'Amiri'}} className="pl-4 text-2xl font-semibold text-black">@{user.username}</Text>
    </TouchableOpacity>
    </View>
  );
};

export default UserResult;
