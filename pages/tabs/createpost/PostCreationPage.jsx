import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import PostResult from "../../../components/results/PostResult";
import Article from "../../../components/posts/subcomponents/Article";

const PostCreationPage = ({ navigation, route, replyingTo, handler}) => {
   
   const {url}= route.params;

    return (
      <ScrollView className="flex-1 bg-primarycolor-4 p-4">
      <View className="mb-4 mt-6">
        {!replyingTo ?(<><Text style={{fontFamily:'Amiri'}} className="text-white text-2xl font-semibold  mb-4">{'Create a Post'}</Text>
                        <Pressable className="bg-white p-4 rounded-2xl mb-4"  onPress={() => {navigation.navigate('ForumSearch') }}   hitSlop={20}>
                            <Text className={handler.forum===''? "text-gray-400": 'text-black'}>{handler.forum===''? "forum name...": handler.forum.toUpperCase()}</Text>
                        </Pressable>
                    </>):(<>
        <Pressable hitSlop={20} onPress={()=>navigation.goBack()} className='mb-3'>
          <FontAwesome name='arrow-left' size={20} color={'white'}/>
        </Pressable>
        <View className='pb-10'>
          <PostResult disabled={true} item={replyingTo} />
        </View>
            <View className="w-px bg-gray-400 h-56 absolute left-2 top-20 " /> 
                </> )}
        <KeyboardAvoidingView className="bg-white p-4 rounded-2xl mb-4">
          <TextInput
            className="text-black h-32"
            placeholder="Write your content here..."
            multiline
            numberOfLines={4}
            value={handler.content}
            onChangeText={(text) => handler.setContent(text)}
            blurOnSubmit={true}
          />
        </KeyboardAvoidingView>

        {url ? (
          <View className="rounded-2xl flex-row mb-3">
            <Article url={url} onArticleFetch={(data)=>{ console.log('data',data);handler.setArticle(data)}} />
            <TouchableOpacity  className='m-4 mt-6' onPress={()=>{handler.setArticle(undefined); navigation.setParams({url:null})}}>
            <FontAwesome name="trash-o" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="flex-row justify-start mb-4 ml-4">
          <TouchableOpacity onPress={()=>navigation.navigate('WebViewScreen')}>
            <Entypo name="browser" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text style={{fontFamily:'Amiri'}} className="text-white">Use Political Analysis</Text>
          <Switch
            value={handler.usePoliticalAnalysis}
            onValueChange={(value) => handler.setUsePoliticalAnalysis(value)}
            style={Platform.OS==='ios'?{backgroundColor:'gray',borderRadius:15}:{}}            
          />
        </View>

        {!handler.isPosting ? (
          <TouchableOpacity className="bg-white p-4 rounded-lg items-center" onPress={()=>{replyingTo?handler.handlePost(replyingTo?.forum): handler.handlePost()}}>
            <Text style={{fontFamily:'Amiri'}} className="text-primarycolor-4 font-bold">Post</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size="small" color="#ffffff" />
        )}
      </View>
   
    </ScrollView>
    );
  };
  export default PostCreationPage;