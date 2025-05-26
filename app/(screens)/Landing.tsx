import { View, Text, Image } from 'react-native';
import { router, usePathname } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useTailwind } from '@/app/hooks/useTailwind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FTlogo from '../(component)/FTlogo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../apis/auth.api';
import { AuthContext } from '@/context/AuthContext';

export default function Landing() {
  const pathname = usePathname(); 
  const tw = useTailwind();
  const [loading, setLoading] = useState(true);
  const { authLogin } = useContext(AuthContext);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    try {
      const username = await AsyncStorage.getItem('username') || '';
      const password = await AsyncStorage.getItem('password') || '';
      console.log("Username from storage:", username);
      if (username && password) {
        const res = await login(username, password || '');
        console.log("Login result:", res);
        if (res?.data) {
          router.replace('/Home'); // ✅ صحيح
          authLogin(res.data.userData)
        } else {
          router.replace('/Boarding1'); // ✅ بدون screens
        }
      } else {
        router.replace('/Boarding1'); // ✅ بدون screens
      }
    }catch (error) {
      console.log("Error checking login:", error);
      router.replace('/Boarding1'); // ✅
    } finally {
     setLoading(false);
    }
  } 



  return (
    <GestureHandlerRootView>
      <Image 
        source={require('../../assets/images/youngSporty.png')}
        style={tw`absolute top-0 left-0 w-full h-full`}
      />
      <View style={tw`flex-1 items-center justify-center bg-gray-950 opacity-80`}>
        <Animatable.View animation="slideInDown" duration={1500}>
          <FTlogo/>
        </Animatable.View>

        <Animatable.View
          animation="fadeIn"
          duration={4000}
          easing="ease"
          style={tw`flex-row`}
        >
          <Text style={tw`text-2xl text-gray-600 font-bold italic`}>
            Fitness
          </Text>
          <Text style={tw`text-2xl text-gray-400 font-bold italic`}>
            Time
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeIn"
          duration={4000}
          iterationCount={'infinite'}
          easing="ease"
          style={tw``}
        >
          <Text style={tw`text-lg text-gray-400 font-bold italic`}>
            Loading
          </Text>
        </Animatable.View>
      </View>
    </GestureHandlerRootView>
  );
}
