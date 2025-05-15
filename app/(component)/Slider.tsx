import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useTailwind } from '@/app/hooks/useTailwind';


type SliderProps = {
  tabs: string[];
  curTab: string;
  setCurTab: (tab: string) => void;
};

const screenWidth = Dimensions.get('window').width;

export default function Slider({ tabs, curTab, setCurTab }: SliderProps) {

    const tw = useTailwind();


  const indicator = useRef(new Animated.Value(0)).current;
  const tabWidth = screenWidth / tabs.length;

  useEffect(() => {
    const index = tabs.indexOf(curTab);
    Animated.spring(indicator, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();
  }, [curTab]);

  useEffect(()=>{
    if(tabs.length != 0 && curTab == ''){
        setCurTab(tabs[0])
    }
  }, [tabs])

  return (
    <View>
      {/* Tabs */}
      <View style={tw`flex-row bg-white/10 rounded-lg mt-3 overflow-hidden`}>
        {tabs.map((tab, index) => {
          const isActive = curTab === tab;
          return (
            <TouchableOpacity
              key={index}
              style={[tw`flex-1 py-3 items-center`]}
              onPress={() => setCurTab(tab)}
            >
              <Text style={tw`${isActive ? 'text-white font-bold' : 'text-white/40'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Animated underline */}
      <Animated.View
        style={{
          height: 3,
          width: tabWidth,
          backgroundColor: tw.color('secondary-500'), // blue-600
          marginTop: 2,
          borderRadius: 999,
          transform: [{ translateX: indicator }],
        }}
      />
    </View>
  );
}
