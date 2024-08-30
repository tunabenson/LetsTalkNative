import { useInfiniteHits } from "react-instantsearch-core";
import UserResult from "./UserResult";
import PostResult from "./PostResult";
import { FlatList } from "react-native";
import SearchListEmptyComponent from "../utility/SearchListEmptyComponent";
import ForumResult from "./ForumResult";

const ResultList=({searchType, navigation, handler, searchEmptyComponent})=>{
    const { hits, isLastPage, showMore } = useInfiniteHits({
      escapeHTML: false,
      
    });
  
  
  
  
    const renderResult = ({ item }) => {
    if(!navigation){
        return <ForumResult item={item} handler={handler}/>
    }
      if (searchType === 'usernames') {
        return <UserResult user={item} navigation={navigation}/>;
      } else if (searchType === 'posts') {
        return <PostResult item={item} navigation={navigation} />;
      }
      else {
        return <ForumResult item={item} navigation={navigation} small={true} />;
      }
    };
    
  
  
    return (
      <FlatList
      data={hits}
      keyExtractor={( item,index) => index.toString()}
      renderItem={renderResult}
      onEndReached={() => {
        if (!isLastPage) {
          showMore();
        }
      }}
      ListEmptyComponent={ searchEmptyComponent ||<SearchListEmptyComponent navigation={navigation} /> }
    />
    );
  }
  export default ResultList;