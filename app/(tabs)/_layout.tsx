import React from 'react'
import { Tabs } from 'expo-router'
import { Image } from 'react-native'
import { useTailwind } from '@/app/hooks/useTailwind'
import { Ionicons } from '@expo/vector-icons';


export default function TabLayout() {

  const tw = useTailwind();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tw.color('white'),
          height: 55,
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 5,
          borderRadius: 40,
          elevation: 5, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
          marginHorizontal: 15,
        },
        tabBarActiveTintColor: tw.color('secondary-400'),
        tabBarInactiveTintColor: tw.color('gray-700'),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              style={tw` ${focused ? 'text-secondary-400' : 'text-gray-700'}`} size={focused ? size * 0.9 : size }
              name="home"
            ></Ionicons>
          ),
          tabBarLabel: 'الرئيسية',
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
            style={tw` ${focused ? 'text-secondary-400' : 'text-gray-700'}`} size={focused ? size * 0.9 : size }
            name="person"
            ></Ionicons>  
          ),
          tabBarLabel: 'الملف الشخصي',
        }}
      />
    </Tabs>

  )
}
