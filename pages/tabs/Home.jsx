import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProfilePage from './Account';
import { auth  } from '../../api/firebaseConfig';
import CreatePost from './CreatePost';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchPage  from './SearchPage';
import TabBarButton from '../../components/utility/tab-navigation/TabBarButton';
import TabBar from '../../components/utility/tab-navigation/TabBar';
import { View } from 'react-native';
import ForumNavigator from '../../navigators/ForumNavigator';
import AccountNavigator from '../../navigators/AccountNavigator';


const Tab= createBottomTabNavigator();




function Home() {
  return (
    <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarShowLabel: false, 
      tabBarStyle: {backgroundColor: '#ffffff00',  borderTopWidth: 0, position: 'absolute', bottom: 10, left: 10, right: 10, height: 92 },
      tabBarIcon: ({focused}) => {
        switch (route.name) {
          case "Home":
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {focused ? <Ionicons name="home" size={24} color="black" style={{marginBottom:5}} /> : <Ionicons name="home-outline" size={24} color="black" />}
              </View>
            );
          case "Create Post":
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {focused ? <AntDesign name="pluscircle" size={30} color="black" style={{marginBottom:5}} /> : <AntDesign name="pluscircleo" size={27} color="black" />}
              </View>
            );
          case "Search":
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                {focused ? <Ionicons name="search-circle-sharp" size={38} color="black" style={{marginBottom:5}} /> : <Ionicons name="search-circle-outline" size={34} color="black" />}
              </View>
            );
          case "Account":
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                {focused ? <MaterialCommunityIcons name="account-circle" size={30} color="black" style={{marginBottom:5}} /> : <MaterialCommunityIcons name="account-circle-outline" size={30} color="black" />}
              </View>
            );
          default:
            return null; // Ensure there's a fallback for unexpected route names
        }
      },
    })}>
    <Tab.Screen
      name="Home"
      component={ForumNavigator}
      options={{
        tabBarButton: props => <TabBarButton route="Home" props={props} />,
      }}
    />
    <Tab.Screen
      name="Create Post"
      component={CreatePost}
      options={{
        tabBarButton: props => <TabBarButton props={props} />,
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchPage}
      options={{
        tabBarButton: props => <TabBarButton  props={props} />,
      }}
    />
    <Tab.Screen
      name="Account"
      component={AccountNavigator}
      initialParams={{username:auth.currentUser.displayName}}
      options={{
        tabBarButton: props => <TabBarButton route="Account" props={props} />,
      }}
    />
  </Tab.Navigator>
);
};



export default Home;
