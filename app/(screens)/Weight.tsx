import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTailwind } from '@/app/hooks/useTailwind';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { addWeight } from '../apis/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../(component)/ScreenWrapper';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 55;

const generateWeights = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => i + min);

export default function Weight() {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [selectedWeight, setSelectedWeight] = useState(75);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const flatListRef = useRef<FlatList>(null);
  const tw = useTailwind();

  const weights = unit === 'kg' ? generateWeights(30, 200) : generateWeights(66, 440);

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setSelectedWeight(weights[index]);
  };

  const handleAddWeight = async () => {
    if(loading) { return }
    try {
      setLoading(true)
      setError(false)
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        console.warn('Username is missing');
        return;
      }
      await addWeight(selectedWeight, username);
      router.navigate('/Hieght');
      setLoading(false)
    } catch (error: any) {
      console.log("Signup error:", error.response?.data?.error || error.message);
      setError(true)
      setLoading(false)
    }
  };

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
            <Text style={tw`text-white text-xl font-semibold text-center mb-6`}>الرجاء تحديد الوزن</Text>
      
            {/* Unit Toggle */}
            <View style={tw`flex-row bg-white/10 rounded-xl overflow-hidden mb-8`}>
              <Pressable
                style={[
                  tw`w-1/2 py-3 items-center`,
                  unit === 'kg' ? tw`bg-secondary-400` : {},
                ]}
                onPress={() => setUnit('kg')}
              >
                <Text style={tw`${unit === 'kg' ? 'text-black font-bold' : 'text-white'}`}>KG</Text>
              </Pressable>
              <Pressable
                style={[
                  tw`w-1/2 py-3 items-center`,
                  unit === 'lb' ? tw`bg-secondary-400` : {},
                ]}
                onPress={() => setUnit('lb')}
              >
                <Text style={tw`${unit === 'lb' ? 'text-black font-bold' : 'text-white'}`}>LB</Text>
              </Pressable>
            </View>

            {/* Weight Display */}
            <View style={tw`items-center mb-2`}>
              <Text style={tw`text-white text-6xl font-extrabold pt-1`}>{selectedWeight}</Text>
              <Text style={tw`text-white text-xl mt-1`}>{unit.toUpperCase()}</Text>
              <AntDesign name="caretdown" size={24} style={tw`text-secondary-400/70 mt-2`} />
          </View>

            {/* Horizontal Picker */}
            <View style={tw`rounded-xl overflow-hidden bg-white/10`}>
              <FlatList
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                contentContainerStyle={{
                  paddingHorizontal: (width - ITEM_WIDTH) / 2,
                  paddingVertical: 16,
                }}
                style={tw`max-h-20`}
                data={weights}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <View style={[
                    tw`w-[54px] items-center justify-center`,
                    item === selectedWeight && tw`border-l-2 border-r-2 border-white`
                  ]}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: item === selectedWeight ? '#fff' : '#999',
                        fontWeight: item === selectedWeight ? '700' : '400',
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                )}
                onMomentumScrollEnd={onScrollEnd}
                getItemLayout={(_, index) => ({
                  length: ITEM_WIDTH,
                  offset: ITEM_WIDTH * index,
                  index,
                })}
                initialScrollIndex={weights.indexOf(selectedWeight)}
              />
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleAddWeight}
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
