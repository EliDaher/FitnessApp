import { View, Text, KeyboardAvoidingView, Platform, Pressable, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useTailwind } from '@/app/hooks/useTailwind';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addGender } from '../apis/auth.api';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../component/ScreenWrapper';

export default function Gender() {
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const maleAnim = useRef(new Animated.Value(1)).current;
  const femaleAnim = useRef(new Animated.Value(0)).current;
  const tw = useTailwind();

  const handleAddGender = async () => {
    
    if(loading) { return }

    try {
      setLoading(true)
      setError(false)
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        console.warn('Username is missing');
        return;
      }
      await addGender(gender, username);
      router.navigate('/screens/Weight');
      setLoading(false)
    } catch (error: any) {
      console.log("Signup error:", error.response?.data?.error || error.message);
      setError(true)
      setLoading(false)
    }
  };

  useEffect(() => {
    Animated.timing(maleAnim, {
      toValue: gender === 'male' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(femaleAnim, {
      toValue: gender === 'female' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [gender]);

  const maleBgColor = maleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [tw.color('white/10') ?? '#333', tw.color('white') ?? '#fff'],
  });

  const femaleBgColor = femaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [tw.color('white/10') ?? '#333', tw.color('white') ?? '#fff'],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-black`}
    >
      <ScreenWrapper showBack={false}>
      {/* Back Button */}
      <Pressable onPress={() => router.back()} style={tw`mt-6 ml-4`}>
        <Text style={tw`text-secondary-400 text-base`}>{'<'} Back</Text>
      </Pressable>

      {/* Main Content */}
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <View style={tw`w-full bg-white/10 border border-white/40 rounded-2xl py-8 px-4`}>
          {error ? <Text style={tw`text-red-500/80 border-2 border-red-500/80 py-2 bg-red-500/20 rounded-xl text-lg font-semibold text-center mb-6`}>حدث خطأ الرجاء اعادة المحاولة</Text> : ''}
          <Text style={tw`text-white text-xl font-semibold text-center mb-6`}>الرجاء تحديد الجنس</Text>

          {/* Gender Options */}
          <View style={tw`flex-row justify-around mb-8`}>
            {/* Male */}
            <Pressable onPress={() => setGender('male')}>
              <Animated.View style={[tw`p-6 rounded-full border items-center`, { backgroundColor: maleBgColor }]}>
                <Ionicons name="male" size={60} style={tw`text-black`} />
              </Animated.View>
              <Text style={tw`text-white text-center mt-2`}>Male / ذكر</Text>
            </Pressable>

            {/* Female */}
            <Pressable onPress={() => setGender('female')}>
              <Animated.View style={[tw`p-6 rounded-full border items-center`, { backgroundColor: femaleBgColor }]}>
                <Ionicons name="female" size={60} style={tw`text-black`} />
              </Animated.View>
              <Text style={tw`text-white text-center mt-2`}>Female / انثى</Text>
            </Pressable>
          </View>

          {/* Continue Button */}
          <Pressable
            onPress={handleAddGender}
            style={tw`bg-white py-3 rounded-xl border border-white/30`}
          >
            <Text style={tw`text-black text-center font-semibold animate-`}>{loading ? 'جاري الحفظ' : 'متابعة' }</Text>
          </Pressable>
        </View>
      </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}
