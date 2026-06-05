import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProjectsScreen from '../screens/app/ProjectsScreen';
import ImagesScreen from '../screens/app/ImagesScreen';
import VideosScreen from '../screens/app/VideosScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#003a6b',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#003a6b',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'saira-bold',
        },
        tabBarActiveBackgroundColor: '#fff',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Projects') {
            iconName = "folder-outline";
          }
          if (route.name === 'Images') {
            iconName = "images-outline";
          }
          if (route.name === 'Videos') {
            iconName = "videocam-outline";
          }
          if (route.name === 'Profile') {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
      initialRouteName="Projects"
    >
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Images" component={ImagesScreen} />
      <Tab.Screen name="Videos" component={VideosScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}