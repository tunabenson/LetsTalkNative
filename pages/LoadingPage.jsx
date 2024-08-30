import LottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'

function LoadingPage() {
  return (
    <View className='flex-1 bg-primarycolor-4 justify-center align-middle'>

    <LottieView
            source={require('../assets/animations/loading-animation.json')}
            autoPlay
            loop
            style={{ width: 400, height: 400 , alignSelf:'center'}}
          />


  </View>
  )
}

export default LoadingPage;