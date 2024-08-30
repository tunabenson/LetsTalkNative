import React, { useState } from 'react'
import { InstantSearch } from 'react-instantsearch-core'
import { SharedElement } from 'react-native-shared-element'
import { searchClient } from '../api/firebaseConfig'
import SearchBox from '../components/utility/SearchBox'
import ResultList from '../components/results/ResultList'
import SearchListEmptyComponent from '../components/utility/SearchListEmptyComponent'
import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PlatformDependantExit from '../components/utility/PlatformDependantExit'

const RequestButton=({request})=>{
  const navigation= useNavigation();
  return (
    <Text  style={{fontFamily:'Amiri'}} onPress={()=>navigation.navigate('request-forum-page', {requestedForum:request})} className='text-lg text-white m-2 p-2  text-center '>Request to Create A Forum?</Text>
  )
}

function ExpandedSearch({retrieveValue, navigation}) {
    const [submitted, setSubmitted]=useState(false);
  return (
    <View className='flex-1 bg-primarycolor-4 '>
      <PlatformDependantExit navigation={navigation}/>
       <InstantSearch searchClient={searchClient} indexName='forums'>
                    <SearchBox
                        placeholder={'forum name...'}
                        customTypingFilter={(text)=>{return text.toUpperCase().replace(/ /g, '_')}}
                        submittedTrigger={(value) => { setSubmitted(value) }}
                        styleExternal='bg-white p-2 rounded-2xl m-4 mt-20 flex-row'
                        styleInternal='text-black flex-1 pl-2 '
                        autoFocus
                    />
            {submitted?(<ResultList handler={(text)=>{retrieveValue(text); navigation.goBack()}} searchType={'forums'} searchEmptyComponent={<SearchListEmptyComponent style='text-center text-white text-lg'   plugin={<RequestButton/>}/>} />)
            :(<SearchListEmptyComponent style='text-center text-white text-lg' customText={"Please Enter your Search"} plugin={<RequestButton/>}/>)}
       </InstantSearch>
    </View>
  )
}

export default ExpandedSearch;