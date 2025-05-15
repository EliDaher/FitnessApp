import { View, Text } from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import { useTailwind } from '../hooks/useTailwind';
import { router, usePathname } from 'expo-router';
import ScreenWrapper from '../(component)/ScreenWrapper';

export default function Loading() {

  const pathname = usePathname(); 
  const tw = useTailwind();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathname == '/Loading') {
        router.navigate('/(tabs)/Home')
      }
    }, 5500);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper>  
      <View style={tw`flex-1 items-center justify-center bg-transparent`}>
        <LottieView
          source={require('../../assets/images/loadingAni.json')}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
          />
      </View>
    </ScreenWrapper>
  );
}
