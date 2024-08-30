import React from 'react'
import LoadingPage from "../LoadingPage";
import {  Dimensions, RefreshControl, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../../components/posts/Post';
import useFetchPosts from '../../hooks/useFetchPosts';

const ForumPage = ({route}) => {
  
    const { posts, refreshing, fetchPosts, fetchMorePosts, header} = useFetchPosts(route?.params?.forumname);

    if(!posts && !header){
      return (
        <LoadingPage/>
      )
    }
      const height=Dimensions.get('window').height;
      return (
        <View className="flex-1 bg-primarycolor-4 " style={{height:height}}>

          <FlashList
            data={posts}
            ListHeaderComponent={header}
            renderItem={({ item }) => (
              <Post item={item} fromForum={route.params?.forumname?true:false} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} tintColor={'#ffff'}/>
            }
            onEndReached={()=>{console.log('end reached'); fetchMorePosts();}}
            onEndReachedThreshold={0.6}
            ListFooterComponent={(<View className='mt-36'></View>)}
            estimatedItemSize={176}
            showsVerticalScrollIndicator={false}
          />

          {(<TouchableOpacity></TouchableOpacity>)}
        </View>
      );

};

export default ForumPage;