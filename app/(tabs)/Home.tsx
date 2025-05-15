import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTailwind } from '@/app/hooks/useTailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import WorkOutWeek from '../(component)/WorkOutWeek';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../(component)/ScreenWrapper';
import BannerSlider from '../(component)/BannerSlider';
import { useTheme } from '@/context/ThemeContext';
import Loading from '../(screens)/Loading';


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
  
  const { toggleMode, mode } = useTheme();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const tw = useTailwind();
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)
  

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

      <Text style={[tw`text-white font-bold text-2xl pr-7 text-right p-4 rounded`]}>
        اهلا {userName}
      </Text>

      {/* Banner slider */}
      <View style={tw`shadow-xl border-t border-r border-l border-white/30 border-4 rounded-lg -mt-2`}>
        <BannerSlider/>
      </View>


      {/* Pages Navigator */}

      <View  style={tw`flex flex-row gap-3 mx-1 overflow-hidden`}>
        <ScrollView horizontal>

          <TouchableOpacity style={tw`mt-5 mr-2 rounded-xl border border-white/50 shadow-lg shadow-white bg-black w-24 py-2`} 
            onPress={()=>{ router.navigate('/Exercises') }}
          >
            <FontAwesome6 name="dumbbell" size={24} style={tw`text-white m-auto`} />
            <Text style={tw`text-white text-center mt-2`}>التمارين</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`mt-5 mr-2 rounded-xl border border-white/50 shadow-lg shadow-white bg-black w-24 py-2`}
            onPress={()=>{ router.navigate('/DietPage') }}
          >
            <FontAwesome6 name="apple-whole" size={24} style={tw`text-white m-auto`} />
            <Text style={tw`text-white text-center mt-2`}>النظام الغذائي</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`mt-5 mr-2 rounded-xl border border-white/50 shadow-lg shadow-white bg-black w-24 py-2`} 
            onPress={()=>{ router.navigate('/WorkoutClasses') }}
          >
            <FontAwesome6 name="person-running" size={24} style={tw`text-white m-auto`} />
            <Text style={tw`text-white text-center mt-2 text-xs`}>الحصص التدريبية</Text>
          </TouchableOpacity>

          {/*<TouchableOpacity style={tw`mt-5 mr-2 rounded-xl border border-white/50 shadow-lg shadow-white bg-black w-24 py-2`} onPress={()=>{ router.navigate('/screens/Exercises') }}>
            <FontAwesome6 name="apple-whole" size={24} style={tw`text-white m-auto`} />
            <Text style={tw`text-white text-center mt-2`}>النظام الغذائي</Text>
          </TouchableOpacity>*/}

        </ScrollView>
      </View>   

      <View style={tw`bg-secondary-500/25 pb-8 rounded-10 mt-5 border-2 border-secondary-400/80`}
        onTouchEnd={()=>{
          router.navigate('/component/UserWorkout')
        }}
      >

        <Text style={tw`text-white font-bold text-2xl mr-5 mt-6 text-right`}>
          ابدأ تمرينك من هنا
        </Text>

        <View>
          <WorkOutWeek />
        </View>

      </View>  


      {/* Theme toggle if needed */}
      <TouchableOpacity onPress={toggleMode} style={tw`absolute top-5 left-5`}>
        <Ionicons name={mode == 'dark' ? "moon" : "sunny"} size={24} style={tw`text-white`} />
      </TouchableOpacity> 

    </ScreenWrapper>
  );
}
