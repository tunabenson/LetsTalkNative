import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ForumPage from '../pages/tabs/ForumPage';



const Stack= createStackNavigator();
function ForumNavigator() {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown:false}}>
        <Stack.Screen name='HomeScreen' component={ForumPage}/>
        <Stack.Screen name='Forum' component={ForumPage}/>
    </Stack.Navigator>
 )
}

export default ForumNavigator;