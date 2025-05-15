import { View, Text, ScrollView, TextInput, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../(component)/ScreenWrapper'
import { useTailwind } from '../hooks/useTailwind'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { updatePersonalDetails } from '../apis/user.api';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable } from 'react-native';
import { Chip } from 'react-native-paper'

export default function CompleteData() {

    const tw = useTailwind()

    const [username, setUsername] = useState<string | undefined>('');
    const [address, setAddress] = useState<string | undefined>('');
    const [job, setJob] = useState<string | undefined>('');
    const [bloodType, setBloodType] = useState<string | undefined>('');
    const [healthConditions, setHealthConditions] = useState<string | undefined>('');
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const suggestions = [
      'سكر',
      'ضغط',
      'دسك',
      'انقراص فقرات',
      'وراثة سكر في العائلة',
      'حساسية من القمح',
    ]
    
    const [selectedConditions, setSelectedConditions] = useState<string[]>([])
    const [showCustomInput, setShowCustomInput] = useState(false)
    const [customCondition, setCustomCondition] = useState('');

    
    const toggleCondition = (condition: string) => {
        if (condition === 'غير ذلك') {
            setShowCustomInput(true)
        } 
        if (selectedConditions.includes(condition)) {
            setSelectedConditions(selectedConditions.filter(item => item !== condition))
        } else {
            setSelectedConditions([...selectedConditions, condition])
        }
    }
    

    const calculateAge = (birthDate: Date): number => {
        if(!birthDate) { return 0}
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        if (!hasHadBirthdayThisYear) age--;
        return age;
    };

    // Handle date change
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShow(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    };

    const [isValidAge, setIsValidAge] = useState<boolean>(true);

      // تحقق من العمر
    useEffect(() => {
        const age = calculateAge(date);
        if (age < 8) {
          setIsValidAge(false);
        } else {
          setIsValidAge(true);
        }
    }, [date]);

    const getUsername = async () => {
        const username = await AsyncStorage.getItem('username');
        setUsername(username || '')
    }
    useEffect(()=>{
        getUsername()
    },[])
    // handle form submission
    const handleSubmit = async () => {
        if(loading) { return }

        try{
            setLoading(true)
            setError(false)
            
            const age = calculateAge(date);
            if (!isValidAge || !username || !address || !job) {
                Alert.alert("يرجى التحقق من البيانات المدخلة!");
            } else {
                const res = await updatePersonalDetails(username, address, job, date, bloodType || '', selectedConditions.join(', '))
                router.replace('/(tabs)/Home')
            }
            setLoading(false)
        } catch (err: any){
            
            console.log("Height error:", err);
            setLoading(false)
            setError(true)

        }
    };
    

  return (
    <ScreenWrapper showBack={false}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={tw`mt-6 ml-4 `}>
          <Text style={tw`text-secondary-400 text-base`}>{'<'} Back</Text>
        </Pressable>
     <View style={tw`flex-1 justify-center items-center px-6`}>
            <View style={tw`w-full bg-white/10 border border-white/40 rounded-2xl py-8 px-4`}>
              {error ? <Text style={tw`text-red-500/80 border-2 border-red-500/80 py-2 bg-red-500/20 rounded-xl text-lg font-semibold text-center mb-6`}>حدث خطأ الرجاء اعادة المحاولة</Text> : ''}
              <Text style={tw`text-white text-xl font-semibold text-center mb-2`}>الرجاء اكمال البيانات الشخصية</Text>
            <ScrollView contentContainerStyle={tw`px-2`}>
              {/* Username */}
              <View style={tw`my-1`}>
                <Text style={tw`text-white mb-1 ml-auto mr-3`}>اسم المستخدم</Text>
                <TextInput
                  placeholder="الرجاء ادخل اسم المستخدم"
                  placeholderTextColor="#999"
                  value={username ? username : 'الرجاء الانتظار'}
                  readOnly={true}
                  style={[
                    tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
                    { borderColor: username ? tw.color('white/40') : 'red' }
                  ]}
                />
              </View>
      
              {/* Address */}
              <View style={tw`my-1`}>
                <Text style={tw`text-white mb-1 ml-auto mr-3`}>العنوان</Text>
                <TextInput
                  placeholder="الرجاء ادخل عنوان سكنك"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  style={[
                    tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
                    { borderColor: address ? tw.color('white/40') : 'red'  }
                  ]}
                />
              </View>
      
              {/* Date of Birth */}
              <View style={tw`my-1`}>
                <Text style={tw`text-white mb-1 ml-auto mr-3`}>المواليد</Text>
                <Text
                  onPress={() => setShow(true)}
                  style={[
                    tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
                    { borderColor: calculateAge(date) > 8 ? tw.color('white/40') : 'red'  }
                  ]}
                >
                  {date.toLocaleDateString()}
                </Text>
                <Text style={tw`text-white text-right mr-3 mt-1`}>
                  العمر: {calculateAge(date)} سنة
                </Text>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                  />
                )}
              </View>
      
              {/* Job */}
              <View style={tw`my-1`}>
                <Text style={tw`text-white mb-1 ml-auto mr-3`}>الوظيفة</Text>
                <TextInput
                  placeholder="الرجاء ادخل وظيفتك"
                  placeholderTextColor="#999"
                  value={job}
                  onChangeText={setJob}
                  style={[
                    tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
                    { borderColor: job ? tw.color('white/40') : 'red'  }
                  ]}
                />
              </View>
      
              {/* Blood Type */}
              <View style={tw`my-1`}>
                <Text style={tw`text-white mb-1 ml-auto mr-3`}>زمرة الدم</Text>
                <TextInput
                  placeholder="الرجاء ادخل زمرة الدم"
                  placeholderTextColor="#999"
                  value={bloodType}
                  onChangeText={setBloodType}
                  style={[
                    tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
                  ]}
                />
              </View>
      
            {/* Health Conditions */}
           <View style={tw`mb-4`}>
              <Text style={tw`text-white mb-2 ml-auto mr-3`}>الأمراض الخاصة</Text>

              <View style={tw`flex-row flex-wrap`}>
                {suggestions.map((condition, index) => (
                  <Chip
                    key={index}
                    selected={selectedConditions.includes(condition)}
                    onPress={() => toggleCondition(condition)}
                    style={[
                      tw`m-1`,
                      selectedConditions.includes(condition)
                        ? tw`bg-purple-600`
                        : tw`bg-white/10 border border-white/40`,
                    ]}
                    textStyle={tw`text-white`}
                  >
                    {condition}
                  </Chip>
                ))}

                {/* غير ذلك */}
                <Chip
                  onPress={() => setShowCustomInput(!showCustomInput)}
                  style={tw`m-1 bg-white/10 border border-white/40`}
                  textStyle={tw`text-white`}
                >
                  {showCustomInput ? 'إلغاء' : 'غير ذلك'}
                </Chip>
              </View>
            
              {/* إدخال مخصص */}
              {showCustomInput && (
                <View style={tw`mt-2 w-full`}>
                  <TextInput
                    value={customCondition}
                    onChangeText={setCustomCondition}
                    placeholder="اكتب اسم الحالة المرضية"
                    placeholderTextColor="#ccc"
                    style={tw`border border-white/30 text-white rounded p-2 text-right mb-2`}
                  />
                  <Chip
                    onPress={() => {
                      if (customCondition.trim()) {
                        setSelectedConditions([...selectedConditions, customCondition.trim()])
                        setCustomCondition('')
                        setShowCustomInput(false)
                      }
                    }}
                    style={tw`bg-secondary-600 w-20 self-end`}
                    textStyle={tw`text-white text-center`}
                  >
                    إضافة
                  </Chip>
                </View>
              )}

              {/* عرض المختار */}
              {selectedConditions.length > 0 && (
                <Text style={tw`text-white mt-2 mr-3 text-sm`}>
                  المختار: {selectedConditions.join(', ')}
                </Text>
              )}
            </View>



      
              {/* Submit Button */}
              <View style={tw`mt-4`}>
                <Text
                  onPress={handleSubmit}
                  style={tw`bg-secondary-500 text-white py-3 rounded-xl text-center`}
                >
                    {
                        loading ? 'جاري حفظ البيانات' : 'حفظ البيانات'
                    }

                </Text>
              </View>
            </ScrollView>
        </View>
        </View>
    </ScreenWrapper>
  )
}