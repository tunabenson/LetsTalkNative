import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Pressable } from 'react-native';
import {  Entypo } from '@expo/vector-icons';
import { auth} from '../../api/firebaseConfig';
import BiasBar from './subcomponents/BiasBar';
import Interaction from './subcomponents/Interaction';
import RenderedArticle from './subcomponents/RenderedArticle';
import Reply from './subcomponents/Reply';
import usePostInteraction from '../../hooks/usePostInteraction';
import { usePopupMenu } from '../../contexts/PopupMenuContext';
import { useNavigation } from '@react-navigation/native';

const Post = (props) => {
  const navigation=useNavigation();
  const { showPopup } = usePopupMenu();
  const { item, fromAccount,fromForum} = props;
  const isPostOwner = auth.currentUser && item.username === auth.currentUser.displayName;
  const { liked, disliked,  toggleLike, toggleDislike, fetchInitialData } = usePostInteraction(props.liked, props.disliked, item.path);
  const [likeStateLoaded, setLikeStateLoaded]= useState(false);
  let seconds=item.date?.seconds || item.date?._seconds;
  useEffect(() => {
  if( liked===undefined || disliked===undefined){
    fetchInitialData().then(()=>setLikeStateLoaded(true));
    }
  }, []);

  const onPressHandler=(event)=>{
    if(props?.onPress){
      props.onPress({...item, liked, disliked});
    }
    else if(!props?.fullScreen){ 
         navigation.navigate('Post', { item, liked, disliked, yValue:event.nativeEvent.pageY-50 });
     }
   }





  return (
    <TouchableOpacity
      disabled={(props?.fullScreen && props?.isMainPost) || !likeStateLoaded}
      className="m-2 p-2 mb-6 bg-white border border-primarycolor-4 rounded-lg shadow-lg"
      onPress={(event)=>onPressHandler(event)}
      activeOpacity={0.7}
    >
    
      <View className="absolute top-2 right-3 flex-row items-center">
        <TouchableOpacity hitSlop={{right:54, left:54, bottom:54, top:54}} onPress={() => {showPopup({isOwner: isPostOwner, path:item.path, text:item.text, forum:item?.forum, author:item.user, editDate:item?.lastEdited || item?.date})}}>
          <Entypo name="dots-three-horizontal" size={24} color="#4D5057" />
        </TouchableOpacity>
      </View>
      <View className="flex-row">
      {!fromAccount && (
          <Pressable
            hitSlop={15}
            
            onPress={() => navigation.navigate('account-page', {username: item.username })}
          >
            <Text style={{fontFamily:'Amiri'}} className="text-md flex-row font-semibold text-amber-700">@{item.username}</Text>
          </Pressable>
       
      )}
      <Text style={{fontFamily:'Amiri'}} className=" text-2xl text-black ml-4">~</Text>
    {item?.forum&& !fromForum &&(
         <Pressable
         hitSlop={15}
         
         onPress={()=>{navigation.navigate('Forum', {forumname: item.forum})}}
       >
    <Text   style={{fontFamily:'Amiri'}} className=" text-sm text-black   "> {item.forum.toUpperCase()}</Text>
    </Pressable>
    )}
     </View>
      <Text style={{fontFamily:'Amiri'}} className="text-md text-gray-800 pb-2 mt-5">{item?.text}</Text>

      {item?.article  &&  (
            <RenderedArticle article={item.article}/>
          )
          }

          <Interaction toggleLike={toggleLike} toggleDislike={toggleDislike} liked={liked} disliked={disliked}  >
          {props?.fullScreen && ( <Reply item={item} onPress={(props?.fullScreen && !props?.isMainPost) ?()=> props?.onPress({...item, liked, disliked}) : undefined}/>)}
          {item?.biasEvaluation && (
        <BiasBar biasEvaluation={item.biasEvaluation}  style=" mt-3 mb-1 flex-row h-3 rounded-sm overflow-hidden border border-black w-1/3 absolute right-2"/>
          )}
          </Interaction>

          <Text style={{fontFamily:'Amiri'}} className="text-sm text-gray-500 self-end mr-2">
            {new Date(seconds * 1000).toLocaleDateString()}
          </Text>
        
          {/* {modalVisible &&(
            <PopupMenu  isUser={isPostOwner} text={item.text} modalVisible={true} path={item.path} onClose={()=>setModalVisible(false)} requestInfo={()=>requestHandler()}/>)
          }  */}
    </TouchableOpacity>
  );
};

export default Post;
