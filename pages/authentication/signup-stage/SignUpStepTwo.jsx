import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useStageTwo } from '../../../hooks/auth-flow/useStageTwo';

const SignUpStepTwo = ({ navigation, route }) => {
  const {selectedForums, forums, showAlert, alertConfig,  toggleForumSelection ,onNext}= useStageTwo(navigation, route);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primarycolor-4 p-4">
      <Text style={{fontFamily:'Amiri'}} className="text-white text-3xl mt-5 font-semibold">Select Your Interests</Text>
      <FlatList className='flex-auto'
        data={forums}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 m-2 rounded-full ${
              selectedForums.includes(item) ? 'bg-white' : 'bg-gray-400'
            }`}
            hitSlop={10}
            onPress={() => toggleForumSelection(item)}
            activeOpacity={0.7}
          >
            <Text style={{fontFamily:'Amiri'}}
              className={`text-center ${
                selectedForums.includes(item) ? 'text-primarycolor-4' : 'text-gray-700'
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={{ alignItems: 'center' }}
      />
      <TouchableOpacity
        className={`w-64 p-4 rounded mt-2 ${
          selectedForums.length >= 3 ? 'bg-white' : 'bg-gray-400'
        }`}
        onPress={onNext}
        activeOpacity={selectedForums.length >= 3 ? 0.7 : 1}
      >
        <Text style={{fontFamily:'Amiri'}} className={`text-center ${selectedForums.length >= 3 ? 'text-primarycolor-4' : 'text-gray-700'}`}>
          Next
        </Text>
      </TouchableOpacity>
     
    </SafeAreaView>
  );
};

export default SignUpStepTwo;
