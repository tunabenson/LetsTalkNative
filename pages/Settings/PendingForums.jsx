import React, { useEffect, useState } from 'react';
import { SectionList, Text, View } from 'react-native';
import Seperator from '../../components/utility/Seperator';
import { getUserForums, getUserRequests } from '../../api/firebaseUtils';
import ForumResult from '../../components/results/ForumResult';

function MyForums({navigation}) {
  const [sections, setSections]=useState([]);

  useEffect(()=>{
    getUserForums().then((value)=>{setSections((prev)=>[...prev, {title:'Forums', data:value}])});
    getUserRequests().then((value)=>{setSections((prev)=>[...prev, {title:'Pending Forums', data:value}])});

  },[]);


  return (
    <View className='bg-primarycolor-4 p-4 flex-1'>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item,section}) => <ForumResult navigation={navigation} item={item} small={true} disabled={section.title==='Pending Forums'}/>}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{fontFamily:'Amiri'}} className='text-lg text-white font-bold p-2'>{title}</Text>
        )}
        ItemSeparatorComponent={() => <Seperator />}
        SectionSeparatorComponent={() => <Seperator />}
      />
    </View>
  );
}

export default MyForums;
