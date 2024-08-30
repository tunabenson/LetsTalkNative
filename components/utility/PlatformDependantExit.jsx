import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Platform, TouchableOpacity } from 'react-native'

function PlatformDependantExit({navigation}) {
  return (
    <>
    {Platform.OS==='android' &&( <TouchableOpacity
        className="absolute top-8 left-2  p-4"
        onPress={() => navigation.goBack()}
        hitSlop={30}
      >
      <AntDesign name="arrowleft" size={20} color="white" />

      </TouchableOpacity>)}
      </>
)
}

export default PlatformDependantExit