import React, { useEffect, useRef, useState } from 'react';
import {View} from 'react-native';
import RenderedArticle from './RenderedArticle';
import EmptyAttachment from '../../utility/EmptyAttachment';
import { getArticleTitleFromURL } from '../../../api/firebaseUtils';
function Article({url, onArticleFetch}) {
  const [article, setArticle] = useState();
  useEffect(()=>{
    const getArticle=async()=>{
        const fetchedArticle= await getArticleTitleFromURL({url});
        const temp={...fetchedArticle, link: url};
        setArticle(temp)
        if (onArticleFetch) {
            onArticleFetch(article);
          } 
    }
    getArticle();       
    
        
    },[] );


  return (
    <View className="flex-1">
      {article ?(<RenderedArticle article={article}/>):(<EmptyAttachment/>)}
    </View>
  );
}

export default Article;
