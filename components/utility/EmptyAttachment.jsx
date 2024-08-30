import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native';

function EmptyAttachment() {
    const [visible, setVisible]= useState(false);
  return (
    <TouchableOpacity onPress={()=>setVisible(true)} className="flex-row items-center bg-gray-200 rounded-lg mb-2">
    <View className="w-20 h-20 mr-2 rounded-md items-center justify-center">
        <MaterialIcons name="article" size={60} color="#4D5057" />
    </View>
    <Text style={{fontFamily:'Amiri'}} className="flex-1 font-bold text-lg mr-1">Article</Text>

    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={()=>setVisible(false)}
    >
    <Text style={{fontFamily:'Amiri'}} className="text-center cursor-vertical-text mt-20 flex-1 text-2xl">Loading...</Text>
      <TouchableOpacity onPress={()=>setVisible(false)} className="items-center justify-center p-2 bg-red-500 mt-2">
        <Text style={{fontFamily:'Amiri'}} className="text-black text-xl p-3">Close</Text>
      </TouchableOpacity>
    </Modal>
  </TouchableOpacity>
  )
}

export default EmptyAttachment;