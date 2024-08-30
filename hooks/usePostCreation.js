import { useState, useCallback } from 'react';
import { auth } from '../api/firebaseConfig';
import { createPost } from '../api/firebaseUtils';
import Toast from 'react-native-toast-message'; // Import Toast here

const usePostCreation = (navigation, url, replyingTo) => {
  const [forum, setForum] = useState('');
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [usePoliticalAnalysis, setUsePoliticalAnalysis] = useState(false);
  const [article, setArticle] = useState();

  const handlePost = async () => {
    setIsPosting(true);
    if (!forum.trim() || !content.trim()) {
      Toast.show({
        type: 'error', // 'error' type for errors
        text1: 'Error',
        text2: 'Please enter both the forum name and the content.',
        visibilityTime: 4000
      });
      setIsPosting(false);
      return;
    }

    const user = auth.currentUser.displayName;
    const post = {
      text: content,
      username: user,
      usePoliticalAnalysis: usePoliticalAnalysis,
    };
    if (url) {
      post.article = article;
    }
    try {
      const response = await createPost({post, path:'posts', forum, isResponse:false});
      Toast.show({
        type: response.header === 'Success' ? 'success' : 'error',
        text1: response.header,
        text2: response.message,
        visibilityTime: 4000,
        onHide: () => {
          if (response.header === 'Success') {
            if(navigation.canGoBack()){
              navigation.goBack();
            }
            setForum('');
            setContent('');
          }
        }
      });
    } catch (error) {
      console.error('Error creating post:', error);
      Toast.show({
        type: 'error',
        text1: 'Error creating post',
        text2: 'Please try again later.',
        visibilityTime: 4000
      });
    }
    setIsPosting(false);
  };

  return {
    forum,
    content,
    isPosting,
    usePoliticalAnalysis,
    article,
    setForum,
    setContent,
    setUsePoliticalAnalysis,
    handlePost,
    setArticle,
  };
};

export default usePostCreation;
