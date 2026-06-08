import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProjectsScreen from '../screens/app/ProjectsScreen';
import ImagesScreen from '../screens/app/ImagesScreen';
import VideosScreen from '../screens/app/VideosScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import { globalStyles, colors, fonts } from '../styles/globalStyles';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ navigation }) {
  const [open, setOpen] = useState(false);

  const navigateTo = url => {
    setOpen(false);
    navigation.navigate('AppHome', {
      screen: url,
    });
  };

  return (
    <>
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
            fontSize: 13,
            fontFamily: 'saira-bold',
          },
          tabBarActiveBackgroundColor: '#fff',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            }
            if (route.name === 'Images') {
              iconName = 'images-outline';
            }
            if (route.name === 'Videos') {
              iconName = 'videocam-outline';
            }
            if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
        initialRouteName="Home"
      >
        <Tab.Screen
          name="Home"
          component={ProjectsScreen}
          listeners={{
            tabPress: e => {
              setOpen(false);
            },
          }}
        />
        <Tab.Screen
          name="Images"
          component={ImagesScreen}
          listeners={{
            tabPress: e => {
              setOpen(false);
            },
          }}
        />
        <Tab.Screen
          name="Create"
          component={() => null}
          options={{
            tabBarButton: props => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.fabContainer}
                onPress={() => setOpen(!open)}
              >
                <View style={styles.fab}>
                  <Ionicons name="add" size={30} color={colors.secondary} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Videos"
          component={VideosScreen}
          listeners={{
            tabPress: e => {
              setOpen(false);
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={{
            tabPress: e => {
              setOpen(false);
            },
          }}
        />
      </Tab.Navigator>
      {open && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigateTo('Images')}
          >
            <Ionicons name="images-outline" size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigateTo('Videos')}
          >
            <Ionicons name="videocam-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: -15,
  },

  fab: {
    width: 64,
    height: 64,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 5,
    borderColor: colors.secondary,
  },

  menuContainer: {
    position: 'absolute',
    bottom: 85,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  menuButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
});