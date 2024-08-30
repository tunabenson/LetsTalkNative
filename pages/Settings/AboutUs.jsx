import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { db } from '../../api/firebaseConfig';
import LoadingPage from '../LoadingPage';

function AboutUs() {
    const [content, setContent]=useState();

    const getAboutUs = async () => {
        const docRef = doc(db, 'appdata', 'aboutus');
        const docSnap = await getDoc(docRef);
        
          setContent(docSnap.data().content); // Assuming content is stored as an array of strings
          console.log(docSnap.data().content);
        
    };

    useEffect(() => {
        getAboutUs();
    }, []);

    if (!content) {
        return <LoadingPage />;
    }

    return (
        <View className="flex-1 p-5 bg-primarycolor-4">
            <FlatList 
            data={content}
            renderItem={({item, index}) => (
                item.type === 'header' ? (
                    <Text style={{fontFamily:'Amiri'}} key={index} className="text-white text-2xl font-bold my-2">
                        {item.text}
                    </Text>
                ) : (
                    <Text  style={{fontFamily:'Amiri'}}key={index} className="text-white text-lg leading-8 mb-4">
                        {item.text}
                    </Text>
                )
            )}
            ListFooterComponent={<View className='mb-10'></View>}/>
        
    </View>
    );
}

export default AboutUs;
