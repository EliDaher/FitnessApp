import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useTailwind } from '@/app/hooks/useTailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import WorkOutWeek from '../(component)/WorkOutWeek';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../(component)/ScreenWrapper';
import BannerSlider from '../(component)/BannerSlider';
import { useTheme } from '@/context/ThemeContext';
import Loading from '../(screens)/Loading';
import { AuthContext } from '@/context/AuthContext';



type Exercise = {
  id: string;
  name: string;
  category: string;
  target: string;
  equipment?: string[];
  bodyPart?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  gifUrl?: string;
};


export default function Home() {
  
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const tw = useTailwind();
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useContext(AuthContext);
  

  const getName = async () => {
    setLoading(true)

    const username = await AsyncStorage.getItem('username');
    if(!username) { router.replace('/Login') }
    setUserName(username || '');
    
    setLoading(false)
  }


  useEffect(()=>{
    getName()

  }, [])


  if(loading) {return <Loading/>}

  return (
    
    
    <ScreenWrapper
    showBack={false}
    >
      <ScrollView className=''>

      {/* Banner slider */}
      <View style={tw`shadow-xl border-t border-r border-l border-white/30 border-4 rounded-lg -mt-2`}>
        <BannerSlider/>
      </View>


      {/* Pages Navigator */}

      <Text style={tw`mt-4 mb-1 mr-3 text-right text-2xl font-bold`}>
        اخترنا لك
      </Text>

        <ScrollView horizontal>
          <View style={tw`flex flex-row-reverse gap-2 mx-1 overflow-hidden`}>

          {user?.type == "admin" && <TouchableOpacity style={tw`mr-4 ml-3 mb-2 p-1 flex items-center`} 
            onPress={()=>{ router.navigate('/Exercises') }}
          >
            <View style={tw`rounded-full bg-white/5 w-20 h-20 py-2 border border-white/20`}>
              <FontAwesome6 name="dumbbell" size={28} style={tw`text-white/90 m-auto`} />
            </View>
            <Text style={tw`text-white text-center text-lg`}>التمارين</Text>
          </TouchableOpacity>}

          <TouchableOpacity style={tw`mr-2 mb-2 p-1 flex items-center`}
            onPress={()=>{ router.navigate('/DietPage') }}
          >
            <View style={tw`rounded-full bg-white/5 w-20 h-20 py-2 border border-white/20`}>
              <FontAwesome6 name="apple-whole" size={28} style={tw`text-white m-auto`} />
            </View>
            <Text style={tw`text-white text-center text-lg`}>النظام الغذائي</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`mr-2 mb-2 p-1 flex items-center`} 
            onPress={()=>{ router.navigate('/WorkoutClasses') }}
          >
            <View style={tw`rounded-full bg-white/5 w-20 h-20 py-2 border border-white/20`}>
              <FontAwesome6 name="person-running" size={28} style={tw`text-white m-auto`} />
            </View>
            <Text style={tw`text-white text-center text-lg`}>الحصص التدريبية</Text>
          </TouchableOpacity>

          </View>   
        </ScrollView>

      <View style={tw`bg-secondary-500/25 pb-8 rounded-10 mt-5 mb-16 mx-2 border-2 border-secondary-400/80`}
        onTouchEnd={()=>{
          router.navigate('/UserWorkout')
        }}
      >

        <Text style={tw`text-white font-bold text-2xl mr-5 mt-6 text-right`}>
          ابدأ تمرينك من هنا
        </Text>

        <View>
          <WorkOutWeek />
        </View>

      </View> 

        </ScrollView>
    </ScreenWrapper>
  );
}
