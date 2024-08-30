import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TabBarButton = ({ props, route }) => {
  const { children, accessibilityState, onPress } = props;
  const selected = accessibilityState.selected;
  const homeRadius = route === 'Home' ? 'rounded-tl-2xl' : '';
  const settingsRadius = route === 'Account' ? 'rounded-tr-2xl' : '';

  // Animation values
  const translateY = useRef(new Animated.Value(0)).current; // Control vertical movement
  const rotate = useRef(new Animated.Value(0)).current;      // Control rotation

  // Trigger the animations on selection change
  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -10, 
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        })
      ]).start();
    } else {
        translateY.resetAnimation()
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0, 
          useNativeDriver: true
        }),
        Animated.timing(rotate, {
          toValue: 0, 
          duration: 0,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [selected]);

  // Interpolating the rotation value
  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'] // Rotate from 0 to 360 degrees
  });

  const buttonStyle = {
    transform: [{ translateY }, { rotate: rotation }], // Apply both translateY and rotation
    position: 'absolute',
    top: -22,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  };

  if (selected) {
    return (
      <View className="flex-1 items-center">
        <View className="flex-row">
          <View className={`flex-1 bg-white ${homeRadius}`} />
          <Svg width={71} height={58} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={'#ffffff'}
            />
          </Svg>
          <View className={`flex-1 bg-white ${settingsRadius}`} />
        </View>

        <Animated.View style={buttonStyle}>
          <TouchableOpacity activeOpacity={1} onPress={onPress} className='w-12 h-12 rounded-full bg-white items-center justify-center pt-1 border-2 border-black'>
            {children}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  } else {
    return (
      <Animated.View className={`flex-1 bg-white justify-center items-center ${route==='Account'?'rounded-tr-lg':''} ${route==='Home'?'rounded-tl-lg':''}`} style={[buttonStyle, { position: 'relative', top: 0, borderRadius: 0 }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          className={`flex-1 bg-white justify-center items-center rounded-bl-lg rounded-br-lg `}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }
};

export default TabBarButton;
