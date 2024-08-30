import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, TouchableOpacity, Modal, View } from 'react-native';
import { WebView } from 'react-native-webview';

const RenderedArticle = ({ article }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const openLink= () => {
    setModalVisible(true);
  };

  const closeLink = () => {
    setModalVisible(false);
  };

  return (
    <TouchableOpacity onPress={openLink} className="flex-row items-center bg-gray-200 rounded-lg mb-2">
      {article.imageUrl ?(<Image source={{ uri: article?.imageUrl }} className="w-20 h-20 mr-2 rounded-md" />)
      :( <View className="w-20 h-20 mr-2 rounded-md items-center justify-center">
        <MaterialIcons name="article" size={60} color="#4D5057" />
    </View>)}
      <Text style={{fontFamily:'Amiri'}} className="flex-1 font-bold text-lg mr-1">{article?.title}</Text>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeLink}
      >
        <WebView source={{ uri: article?.link }} />
        <TouchableOpacity onPress={closeLink} className="items-center justify-center p-2 bg-red-500 mt-2">
          <Text style={{fontFamily:'Amiri'}} className="text-white text-xl p-3">Close</Text>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};
export default RenderedArticle;
