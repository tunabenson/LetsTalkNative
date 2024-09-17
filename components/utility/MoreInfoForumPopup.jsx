import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

function MoreInfoForumPopup({ forum, onClose }) {
  return (
    <Modal transparent={true} animationType='slide' visible={true}>
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
          <View className="bg-white p-5 rounded-xl shadow-lg max-w-11/12 m-4">
            <View className="flex-row justify-between items-center mb-5">
              <Text style={{fontFamily:'Amiri'}} className='text-4xl text-center font-bold'>Forum Details</Text>
            </View>
            <View className="flex-row justify-start items-center mb-5">
              <Text style={{fontFamily:'Amiri'}} className='text-2xl font-semibold'>Author: </Text>
              <Text style={{fontFamily:'Amiri'}} className='text-2xl'>@{forum?.author}</Text>
            </View>
            <View className="flex-row justify-start items-center mb-5">
              <Text style={{fontFamily:'Amiri'}} className="text-2xl font-medium">Created At:</Text>
              <Text style={{fontFamily:'Amiri'}} className="text-xl pl-4">{new Date(forum?.date?.seconds * 1000 + forum?.date?.nanoseconds / 1000000).toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default MoreInfoForumPopup;
