// hooks/usePostCreation.js
import { useState } from 'react';
import { auth } from '../api/firebaseConfig';
import { createPost } from '../api/firebaseUtils';
import Toast from 'react-native-toast-message';

const usePostResponse = (navigation, url, replyingTo) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [usePoliticalAnalysis, setUsePoliticalAnalysis] = useState(false);
  const [article, setArticle] = useState();

  const handlePost = async (parentForum) => {
    setIsPosting(true);
    if (!content.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the content of your post.',
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
    console.log('outside of if',article)
    if(article){
      console.log(article)
      post.article=article;
    }

    try {
      const response = await createPost({post, forum: parentForum, path: replyingTo.path?.concat('/replies'), isResponse: true});
      Toast.show({
        type: response.header === 'Success' ? 'success' : 'error',
        text1: response.header,
        text2: response.message,
        onHide: () => {
          if (response.header === 'Success') {
            if(navigation.canGoBack()){
              navigation.goBack();
            }
            setContent('');
          }
        }
      });
    } catch (error) {
      console.error('Error creating post:', error);
      Toast.show({
        type: 'error',
        text1: 'Error creating post',
        text2: 'Please try again later.'
      });
    } finally {
      setIsPosting(false);
    }
  };

  return {
    content,
    isPosting,
    usePoliticalAnalysis,
    article,
    setContent,
    setUsePoliticalAnalysis,
    handlePost,
    setArticle,
  };
};

export default usePostResponse;
