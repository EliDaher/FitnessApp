import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTailwind } from '@/app/hooks/useTailwind'
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { addHeight } from '../apis/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../(component)/ScreenWrapper';

const ITEM_HEIGHT = 60;
const { height } = Dimensions.get('window');

const generateHeights = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => max - i);

export default function Height() {
  const [selectedHeight, setSelectedHeight] = useState(165);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const flatListRef = useRef<FlatList>(null);
  const tw = useTailwind();

  const heights = generateHeights(120, 200); // From 200 down to 120

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setSelectedHeight(heights[index]);
  };

  const handleAddHeight = async () => {
    if(loading){ return }
    try {
      setLoading(true)
      setError(false)
      const username = await AsyncStorage.getItem('username');

      if (!username) {
        // مثلاً: إظهار تنبيه أو إعادة التوجيه لتسجيل الدخول
        console.warn('Username is missing');
        return;
      }

      const response = await addHeight(
        selectedHeight,
        username,
      );
      router.navigate('/CompleteData')
      setLoading(false)
    } catch (error: any) {
      console.log("Height error:", error.response?.data?.error || error.message);
      setLoading(false)
      setError(true)

    }
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-black`}
    >
    <ScreenWrapper>
    {/* Back Button */}
    <Pressable onPress={() => router.back()} style={tw`mt-6 ml-4`}>
      <Text style={tw`text-secondary-400 text-base`}>{'<'} Back</Text>
    </Pressable>

        {/* Main Content */}
        <View style={tw`flex-1 justify-center items-center px-3`}>
          <View style={tw`w-full bg-white/10 border border-white/40 rounded-2xl py-8 px-4`}>
            {error ? <Text style={tw`text-red-500/80 border-2 border-red-500/80 py-2 bg-red-500/20 rounded-xl text-lg font-semibold text-center mb-6`}>حدث خطأ الرجاء اعادة المحاولة</Text> : ''}

            <Text style={tw`text-white text-3xl font-semibold text-center mb-6`}>
              كم يبلغ طولك ؟
            </Text>

      {/* Value Display */}
      <View style={tw`items-center mb-2`}>
        <Text style={tw`text-white text-4xl font-extrabold pt-4`}>
          {selectedHeight} <Text style={tw`text-xl`}>Cm</Text>
        </Text>
      </View>

      {/* Vertical Picker */}
      <View style={tw`flex-row justify-center items-center mt-2`}>
        <AntDesign name="caretleft" size={24}  style={tw`mr-2 text-secondary-400/70`} />

        <View style={[tw`h-[300px] w-[80px] rounded-xl overflow-hidden bg-white/10`]}>
          <FlatList
            ref={flatListRef}
            data={heights}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={onScrollEnd}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={heights.indexOf(selectedHeight)}
            contentContainerStyle={{
              paddingVertical: (300 - ITEM_HEIGHT) / 2,
            }}
            renderItem={({ item }) => (
              <View style={[
                tw`h-[59.8px] justify-center items-center`, 
                item === selectedHeight && tw`border-t-2 border-b-2 border-white`]}
              >
                <Text style={[tw`text-xl`, { color: item === selectedHeight ? 'white' : '#777' }]}>
                  {item}
                </Text>
              </View>
            )}
          />
        </View>
        <AntDesign name="caretright" size={24}  style={tw`ml-2 text-secondary-400/70`} />
      </View>

              {/* Continue Button */}
              <Pressable
                onPress={handleAddHeight}
                style={tw`bg-white py-3 rounded-xl border border-white/30 mt-5`}
              >
                <Text style={tw`text-black text-center font-semibold animate-`}>{loading ? 'جاري الحفظ' : 'متابعة' }</Text>
              </Pressable>
          </View>
      </View>
      
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
}
