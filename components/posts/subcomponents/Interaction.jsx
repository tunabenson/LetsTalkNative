import { FontAwesome } from '@expo/vector-icons';
import React, { useRef } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native';

/**
 * this component is used to render the interactions component of the Post parent Component
 *
 * @param {boolean} liked - status of liked interaction.
 * @param {boolean} disliked - status of disliked interaction
 * @param {function} toggleDislike- handler for toggling dislike interaction on screen
 * @param {function} toggleLike- handler for toggling like interaction on screen
 */


function Interaction({toggleDislike, toggleLike, liked, disliked, children}) {
  const scaleLike = useRef(new Animated.Value(1)).current;
  const scaleDislike = useRef(new Animated.Value(1)).current;

  const animateScale = (animation, isActive) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2, 
        duration: 150, 
        useNativeDriver: true
      }),
      Animated.timing(animation, {
        toValue: 1, 
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleLikePress = () => {
    animateScale(scaleLike, liked);
    toggleLike();
  };

  const handleDislikePress = () => {
    animateScale(scaleDislike, disliked);
    toggleDislike(); 
  };

  return (
    <View className="flex-row items-center mt-2 ">
    <TouchableOpacity hitSlop={25} onPress={handleLikePress} className="flex-row items-center mr-5" >
    <Animated.View style={{ transform: [{ scale: scaleLike }] }}>
          <FontAwesome name="thumbs-up" size={25} color={liked ? '#21A179' : '#4D5057'} />
    </Animated.View>    
  </TouchableOpacity>

    <TouchableOpacity hitSlop={25} onPress={handleDislikePress} className="flex-row items-center">
    <Animated.View style={{ transform: [{ scale: scaleDislike }] }}>
          <FontAwesome name="thumbs-down" size={25} color={disliked ? '#FA003F' : '#4D5057'} />
        </Animated.View>    
      </TouchableOpacity>  
      {children}
  </View>

  )
}

export default Interaction;