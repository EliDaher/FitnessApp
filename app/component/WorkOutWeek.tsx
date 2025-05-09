import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { navigate } from 'expo-router/build/global-state/routing';
import { Ionicons } from '@expo/vector-icons';
import { useTailwind } from '@/app/hooks/useTailwind';




type WeekDay = {
  day: string;
  date: number;
};

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sunday as index 0

function getWeekDays(): { days: WeekDay[]; currentIndex: number } {
  const today = new Date();
  const currentDayIndex = today.getDay(); // Sunday = 0
  const days: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - currentDayIndex + i);
    days.push({
      day: dayLabels[i],
      date: date.getDate(),
    });
  }

  return { days, currentIndex: currentDayIndex };
}


export default function WorkOutWeek() {


    const tw = useTailwind();
    const { days, currentIndex } = getWeekDays();
    const [userName, setUserName] = useState('')
    
    


  return (<>
      {/* Calendar Section */}
      <View style={tw`mt-6`}>
        <View style={tw`flex-row justify-around items-center px-4`}>
          {days.map((day, index) => (
            <View key={index} style={tw`items-center`}>
              <Text style={tw`text-white`}>{day.day}</Text>
              <View
                style={
                  index === currentIndex
                    ? tw`bg-secondary-500 w-8 h-8 rounded-full items-center justify-center mt-1`
                    : tw`mt-1`
                }
              >
                <Text
                  style={
                    index === currentIndex
                      ? tw`text-black font-bold`
                      : tw`text-white`
                  }
                >
                  {day.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Start WorkOut Box */}
      <View style={tw`bg-secondary-500 mx-4 mt-4 rounded-xl p-4 flex-row-reverse justify-between items-center`}>
        
        <View style={tw`absolute right-30 flex-row`}>
          <Ionicons name="arrow-back" size={86} style={tw`text-white/40`} />
          <Ionicons name="arrow-back" size={86} style={tw`text-white/40`} />
          <Ionicons name="arrow-back" size={86} style={tw`text-white/40`} />
        </View>
          

        <View>
          <Text style={tw`text-white font-bold text-2xl`}>تمرين اليوم</Text>
          <Text style={tw`text-white text-lg mt-1`}>انقر لنبدأ التمرين !!</Text>
        </View>
       {/* <Image
          source={require('@/assets/images/boarding1.png')} // ضع صورتك هنا
          style={tw`w-20 h-20`}
          resizeMode="contain"
        />*/}
      </View>
  </>)
}