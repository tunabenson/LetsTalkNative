import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

const WebViewScreen = ({ navigation, getUrl}) => {
    const webViewRef = useRef(null);
    let url='';
    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            className=" ml-5 mb-2 bg-primarycolor-4 p-2 rounded-2xl flex-row"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="caretleft" size={20} color="white" />
            <Text style={{fontFamily:'Amiri'}} className="text-white text-2xl">Exit</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            className=" mr-5 mb-2 flex-row-reverse bg-green-500 p-2 rounded-2xl"
            onPress={() => {
              getUrl(url);
              navigation.navigate('postCreation', { url: url });
            }}
          >
            <Ionicons name="document-attach" size={20} color="white" />
            <Text style={{fontFamily:'Amiri'}} className="text-white text-2xl mr-2">Attach Link</Text>
          </TouchableOpacity>
        ),
      });
    }, []);


    return (
      <View className="bg-black flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://news.google.com' }}
          allowUniversalAccessFromFileURLs={true}
          originWhitelist={['*']}
          onNavigationStateChange={(event)=>{
            url=event.url;
          }}
          
        />
      </View>
    );
  };
  export default WebViewScreen;