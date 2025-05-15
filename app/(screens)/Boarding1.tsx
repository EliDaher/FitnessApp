import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTailwind } from '@/app/hooks/useTailwind'
import { router } from 'expo-router';

export default function Boarding1() {
  const [shownImg, setShownImg] = useState(1);
  const [pageText, setPageText] = useState('Start your journey towards a more active lifestyle');

  const fadeAnim1 = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current; 
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const tw = useTailwind();

  useEffect(()=>{
    (shownImg > 3 ? router.replace("/Login") : "")
  },[shownImg])

  useEffect(()=>{
    switch (shownImg) {
        case 1:
            setPageText('Start your journey towards a more active lifestyle')
            break;
        case 2:
            setPageText('Find nutrition tips that fit your lifestyle')
            break;
        case 3:
            setPageText('A community for you, challenge yourself')
            break;
        default:
            break;
    }
  }, [shownImg])

  useEffect(() => {
    if (shownImg === 1) {
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(fadeAnim2, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (shownImg === 2) {
      Animated.timing(fadeAnim1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (shownImg === 3) {
      Animated.timing(fadeAnim1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [shownImg]);

  return (
    <View style={tw`flex-1`}>
      {/* خلفية متحركة 1 */}
      <Animated.Image
        source={require('../../assets/images/boarding1.png')}
        resizeMode="cover"
        style={[
          tw`absolute top-0 left-0 w-full h-full`,
          { opacity: fadeAnim1 },
        ]}
      />

      {/* خلفية متحركة 2 */}
      <Animated.Image
        source={require('../../assets/images/boarding2.png')}
        resizeMode="cover"
        style={[
          tw`absolute top-0 left-0 w-full h-full`,
          { opacity: fadeAnim2 },
        ]}
      />
      {/* خلفية متحركة 3 */}
      <Animated.Image
        source={require('../../assets/images/boarding3.png')}
        resizeMode="cover"
        style={[
          tw`absolute top-0 left-0 w-full h-full`,
          { opacity: fadeAnim3 },
        ]}
      />

      {/* خلفية التعتيم */}
      <View style={tw`absolute top-0 left-0 w-full h-full bg-gray-950 opacity-70`} />

      {/* المحتوى */}
      <View style={tw`absolute top-43% w-full`}>
        <View style={tw`bg-gray-600 opacity-80 py-5 px-4 absolute h-40 -mt-7 w-full border-t border-b border-white`}>
          </View>
          <View>
            
          <Animated.Image
            source={require('../../assets/images/workOut.png')}
            style={[tw`mx-auto mb-4 ${shownImg == 1 ? `block`: `hidden`}`,
                { opacity: fadeAnim1 },

            ]}
          />
          <Animated.Image
            source={require('../../assets/images/nutrition.png')}
            style={[tw`mx-auto mb-4 ${shownImg == 2 ? `block`: `hidden`}`,
                { opacity: fadeAnim2 },

            ]}
          />
          <Animated.Image
            source={require('../../assets/images/community.png')}
            style={[tw`mx-auto mb-4 ${shownImg == 3 ? `block`: `hidden`}`,
                { opacity: fadeAnim2 },

            ]}
          />
          <Text style={tw`text-white font-bold text-xl text-center`}>
            {pageText}
          </Text>
        </View>

        {/* زر التالي */}
        <TouchableOpacity
          onPressIn={() => {
            if (shownImg < 4) setShownImg(shownImg + 1);
          }}
          style={tw`self-center px-14 py-3 rounded-full bg-white/20 border border-white absolute top-[150px]`}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
