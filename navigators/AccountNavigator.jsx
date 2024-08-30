import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import SettingsPage from '../pages/Settings/SettingsPage';
import MyForums from '../pages/Settings/PendingForums';
import LikedPosts from '../pages/Settings/LikedPosts';
import EditUser from '../pages/Settings/EditUser';
import Account from '../pages/tabs/Account';
import AboutUs from '../pages/Settings/AboutUs';



const Stack= createStackNavigator();
function AccountNavigator({ route}) {
  return (
    <Stack.Navigator initialRouteName={'ProfilePage'} screenOptions={{headerShown:false}}>
        <Stack.Screen name="ProfilePage" component={Account} initialParams={route.params} options={{ headerShown: false }} />
        <Stack.Screen name='Settings' component={SettingsPage} />
        <Stack.Screen name='Liked-Posts' component={LikedPosts}/>
        <Stack.Screen name='MyForums' component={MyForums} />
        <Stack.Screen name='EditAccount' component={EditUser} />
        <Stack.Screen name='About' component={AboutUs} />

    </Stack.Navigator>
  )
}

export default AccountNavigator