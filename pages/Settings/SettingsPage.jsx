import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AntDesign, FontAwesome, Octicons } from '@expo/vector-icons';
import Option from '../../components/utility/Option'; 
import Toast from 'react-native-toast-message';
import { auth } from '../../api/firebaseConfig';

const SettingsPage = ({navigation, route}) => {
  return (
    <ScrollView className="flex-1 bg-primarycolor-4">
      <View className=' p-3'></View>
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={()=>navigation.navigate('EditAccount',{...route.params})}
        icon={<FontAwesome name="user" size={24} color="#4D5057" />}
        text="Edit Profile"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={()=>navigation.navigate('MyForums')}
        icon={<Octicons name="comment-discussion" size={24} color="#4D5057" />}
        text="See My Forums"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={()=>{Toast.show({type:'info', text1:'Feature Unavailable', text2:'Sorry this feature is currently unavailable'})}}
        icon={<AntDesign name="heart" size={24} color="#4D5057" />}
        text="My Liked Posts"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={()=>{navigation.navigate('About')}}
        icon={<FontAwesome name="book" size={24} color="#4D5057" />}
        text="About"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />

      {/* Themes and Customization */}
      <Option 
        style="p-2 mt-2 flex-row bg-white rounded-xl border border-b-4 border-red-600 "
        handler={()=>auth.signOut()}
        icon={<FontAwesome name="sign-out" size={24} color="#4D5057" />}
        text="Sign Out"
        textStyle="text-gray-600 text-xl font-semibold ml-2"
      />
    </ScrollView>
  );
};

export default SettingsPage;
