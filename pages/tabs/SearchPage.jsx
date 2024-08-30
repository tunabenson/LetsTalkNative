 import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import {  searchClient } from '../../api/firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import { FullPostScreen } from '../ExpandedPosts/FullPostScreen';
import ProfilePage from './Account';
import { InstantSearch, useInfiniteHits, useSearchBox } from 'react-instantsearch-core';

import SearchBox from '../../components/utility/SearchBox';
import ResultList from '../../components/results/ResultList';
import SearchListEmptyComponent from '../../components/utility/SearchListEmptyComponent';





const SearchPage= ({navigation}) => {
  const [searchType, setSearchType] = useState('usernames'); 
  const [submitted, setSubmitted]=useState(false);
 

  return (
    <View className="flex-1 bg-primarycolor-4 shadow-lg">
      <View className=" m-4 mt-10 p-5 justify-center bg-white rounded-xl">
        <InstantSearch  searchClient={searchClient} indexName={searchType} >
        <SearchBox includeSearchButton={true} placeholder={'Search...'}  submittedTrigger={()=>setSubmitted((prev)=>!prev)}/>
        <View className="flex-row justify-around mb-4">
          <TouchableOpacity onPress={() => {setSearchType('usernames'); }} className={`p-2 rounded-lg ${searchType === 'usernames' ? 'bg-primarycolor-4' : 'bg-gray-200'}`}>
            <Text style={{fontFamily:'Amiri'}} className={searchType === 'usernames' ? 'text-white' : 'text-black'}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSearchType('forums'); }} className={`p-2 rounded-lg ${searchType === 'forums' ? 'bg-primarycolor-4' : 'bg-gray-200'}`}>
            <Text style={{fontFamily:'Amiri'}} className={searchType === 'forums' ? 'text-white' : 'text-black'}>Forums</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSearchType('posts'); }} className={`p-2 rounded-lg ${searchType === 'posts' ? 'bg-primarycolor-4' : 'bg-gray-200'}`}>
            <Text style={{fontFamily:'Amiri'}} className={searchType === 'posts' ? 'text-white' : 'text-black'}>Posts</Text>
          </TouchableOpacity>
        </View>
        {submitted?(<ResultList searchType={searchType} navigation={navigation}/>):(<SearchListEmptyComponent customText={'Please Enter your Search'}/>)}
        </InstantSearch>
      
      </View>

    
    </View>
  );
};
export default SearchPage;