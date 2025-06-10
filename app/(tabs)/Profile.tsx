import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useTailwind } from '../hooks/useTailwind'
import { router } from 'expo-router';
import Slider from '../(component)/Slider'
import { getUserData } from '../apis/user.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PersonalDetails from '../(component)/PersonalDetails';
import Status from '../(component)/Status';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import Loading from '../(screens)/Loading';


type userType = {
  email: string,
  fullname: string,
  gender: string,
  height: number,
  password: string,
  username: string,
  weight: number,
  address: string,
  date: Date,
  job: string,
  bloodType: string,
  healthConditions: string,
  
}


export default function Profile() {

  const tw = useTailwind();
  const { toggleMode, mode } = useTheme();
  const { logout } = useContext(AuthContext)

  const [curTab, setCurTab] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [userData, setUserData] = useState<userType | null>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(()=>{
    if(userData?.username){
      if( !userData?.date || userData.address == '' || !userData.address){
        router.navigate('/CompleteData')
      }
    }
  }, [userData?.date])

  const getData = async () => {
    setLoading(true)

    const username = await AsyncStorage.getItem('username');
    if (!username) {
      // مثلاً: إظهار تنبيه أو إعادة التوجيه لتسجيل الدخول
      console.warn('Username is missing');
      return;
    }

    const res = await getUserData(username)
    const temData = res.data.userData
    setUserData(temData)

    setLoading(false)
  }

  useEffect(()=>{
    getData()
  }, [])


  if (loading) { return <Loading/> }
  return (
    <View style={tw`bg-black flex-1`}>

      {/* Profile Header */}

      <View style={tw`items-center mt-8`}>

        <View style={tw`w-36 h-36 rounded-full border-2 border-white/50 text-center`}>
        {
          imgUrl != '' ? 
            <Image 
            source={require('@/assets/images/boarding3.png')}
            style={tw`w-36 h-36 rounded-full border-2 border-white/50`}
            />
            :
            <Ionicons name="person" size={86} style={tw`text-white m-auto`} />

        }
        </View>

        <Text style={tw`text-white text-xl font-bold mt-3`}>
          {userData?.fullname}
        </Text>
      </View>


      {/* Profile Slider */}

      <Slider tabs={['المعلومات الشخصية', 'تتبع الحالة', 'معلومات الحساب']} curTab={curTab} setCurTab={setCurTab}></Slider>


      {/* Main Content */}

      {
        curTab =='المعلومات الشخصية' ? 
          <PersonalDetails userData={userData} />
        : 
          <Status />
      }


      {/* Theme toggle if needed */}
      <TouchableOpacity onPress={toggleMode} style={tw`absolute top-5 right-15`}>
        <Ionicons name={mode == 'dark' ? "moon" : "sunny"} size={24} style={tw`text-white`} />
      </TouchableOpacity>

      {/* Sitting button */}
      <TouchableOpacity onPress={()=>{
          console.log('hi')
        }} 
        style={tw`absolute top-5 right-5`}>
        <Ionicons name="settings-outline" size={24} style={tw`text-white`} />
      </TouchableOpacity>
      
      {/* Logout Button */}
      <TouchableOpacity 
        onPress={logout} 
        style={tw`absolute top-5 left-5`}
      >
        <Ionicons name="log-out-outline" size={24} style={tw`text-white`} />
      </TouchableOpacity>

    </View>
  )
}