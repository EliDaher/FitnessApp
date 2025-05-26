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
          backgroundColor: tw.color('black'),
          height: 55,
          width: '100%',
          position: 'absolute',
          elevation: 5, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
        },
        tabBarActiveTintColor: tw.color('white/80'),
        tabBarInactiveTintColor: tw.color('white/50'),
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
              style={tw` ${focused ? 'text-white' : 'text-white/80'}`} size={focused ? size * 0.9 : size }
              name={`${focused ? `home` : `home-outline`}`}
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
            style={tw` ${focused ? 'text-white' : 'text-white/80'}`} size={focused ? size * 0.9 : size }
            name={`${focused ? `person` : `person-outline`}`}
            ></Ionicons>  
          ),
          tabBarLabel: 'الملف الشخصي',
        }}
      />
    </Tabs>

  )
}
