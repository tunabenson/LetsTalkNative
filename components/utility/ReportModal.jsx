import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Toast from 'react-native-toast-message';

function ReportModal({close, submitHandler}) {
  const reportReasons = [
    "I Just Don't Like It",
    'Spam or misleading',
    'Hate speech',
    'Harassment or bullying',
    "Disrespectful",
    'Other',
  ];

  // State to hold the index of the currently selected reason
  const [selectedReason, setSelectedReason] = useState();

  // Function to handle selecting/deselecting reasons
  const toggleReason = (index) => {
    setSelectedReason(index)
  };

  // Function to submit the report
  const handleSubmit = () => {
    if(selectedReason){
    submitHandler({reason: reportReasons[selectedReason], date: Timestamp.now()})
    }
    else{
        Toast.show({type:"error", text1:'Error' ,text2: 'Please select a reason for your report', visibilityTime:1000})
    }
  };

  return (
    <Modal animationType='slide' transparent={true} visible={true}>
    <TouchableWithoutFeedback onPress={()=>close()}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <View className="bg-white p-4 rounded-lg w-11/12">
          <ScrollView>
            {reportReasons.map((reason, index) => (
              <TouchableOpacity key={index} onPress={() => toggleReason(index)} style={{ paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: index===selectedReason ? 'blue' : 'grey', borderRadius: 8, marginBottom: 10 }}>
                <Text style={{fontFamily:'Amiri'}}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 20 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ReportModal;
