import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  I18nManager,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import React, { useEffect, useState } from 'react';
import FTlogo from '../(component)/FTlogo';
import { useTailwind } from '@/app/hooks/useTailwind';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signup } from '../apis/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [lastName, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusField, setFocusField] = useState<
    | 'fatherName'
    | 'lastName'
    | 'confirm'
    | 'email'
    | 'firstName'
    | 'number'
    | 'password'
    | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false)

  const tw = useTailwind();

  useEffect(() => {
    // تفعيل دعم RTL
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      // من الأفضل إعادة تشغيل التطبيق إذا تغيّر الاتجاه
    }
  }, []);

  const handleSignUp = async () => {
    setLoading(true)
    if (!firstName || !fatherName || !lastName || !number || !password || !confirmPassword) {
      let newErrors: { [key: string]: boolean } = {};
      if (!firstName) newErrors.firstName = true;
      if (!fatherName) newErrors.fatherName = true;
      if (!lastName) newErrors.lastName = true;
      if (!number) newErrors.number = true;
      if (!password) newErrors.password = true;
      if (!confirmPassword) newErrors.confirmPassword = true;

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        alert('يرجى ملء جميع الحقول');
        setLoading(false)
        return;
      }

    }

    if (password !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين');
      setLoading(false)
      return;
    }

    const name = `${firstName} ${fatherName} ${lastName}`;
    setFullName(name);

    try {
      const response = await signup(name, name, number, password);
      await AsyncStorage.setItem('username', name);
      await AsyncStorage.setItem('password', password);
      console.log('User signed up:', response.data);
      if(response.data.success == true){
        router.navigate('/Gender');
      }
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      let newErrors: { [key: string]: boolean } = {};
      newErrors.resError = true
      error.response?.data?.error.includes('Username') 
        ? alert('الاسم موجود مسبقاً') 
        : alert('حدث خطأ');
      console.log('Signup error:', error.response?.data?.error || error.message);

    }
  };

  const convertToEnglishNumbers = (text: string) => {
    return text.replace(/[\u0660-\u0669]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-black`}
    >
      {[{ icon: 'fitness', top: '75%', left: '20%' }, { icon: 'basketball', top: '10%', left: '80%' }, { icon: 'bicycle', top: '80%', left: '75%' }, { icon: 'flash', top: '15%', left: '10%' }].map((item, i) => (
        <Animatable.View
          key={i}
          animation={{ from: { translateY: -20 }, to: { translateY: 20 } }}
          duration={1200 + i * 200}
          iterationCount="infinite"
          direction="alternate"
          easing="ease"
          style={tw`absolute top-[${item.top}] left-[${item.left}]`}
        >
          <Ionicons style={tw`text-white opacity-20`} size={56} name={item.icon as any} />
        </Animatable.View>
      ))}

      <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center px-6`}>
        <FTlogo />

        <View style={tw`w-full ${errors.resError ? `bg-red-100` : `bg-white/5`} border border-white/10 rounded-2xl mt-10 py-8 px-4`}>
          <Text style={tw`text-white text-xl font-semibold text-center mb-4`}>إنشاء حساب</Text>

          <View style={tw`mb-4 flex-row-reverse justify-between gap-2`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white mb-1 mr-2 text-right`}>الاسم الأول</Text>
              <TextInput
                placeholder="الاسم الأول"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocusField('firstName')}
                onBlur={() => setFocusField(null)}
                style={tw`text-right bg-white/10 text-white px-4 py-3 rounded-xl border ${
                  focusField === 'firstName' ? 'border-white' :  errors.firstName
                  ? 'border-red-500'
                  : 'border-white/20'
                }`}
              />
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-white mb-1 mr-2 text-right`}>اسم الأب</Text>
              <TextInput
                placeholder="اسم الأب"
                placeholderTextColor="#999"
                value={fatherName}
                onChangeText={setFatherName}
                onFocus={() => setFocusField('fatherName')}
                onBlur={() => setFocusField(null)}
                style={tw`text-right bg-white/10 text-white px-4 py-3 rounded-xl border ${
                  focusField === 'fatherName' ? 'border-white' : errors.fatherName
                  ? 'border-red-500'
                  : 'border-white/20'
                }`}
              />
            </View>

            <View style={tw`flex-1`}>
              <Text style={tw`text-white mb-1 mr-2 text-right`}>الكنية</Text>
              <TextInput
                placeholder="الكنية"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusField('lastName')}
                onBlur={() => setFocusField(null)}
                style={tw`text-right bg-white/10 text-white px-4 py-3 rounded-xl border ${
                  focusField === 'lastName' ? 'border-white' : errors.lastName
                  ? 'border-red-500'
                  : 'border-white/20'
                }`}
              />
            </View>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 mr-2 text-right`}>رقم الجوال</Text>
            <TextInput
              placeholder="رقم الهاتف"
              placeholderTextColor="#999"
              value={number}
              onChangeText={(text) => setNumber(convertToEnglishNumbers(text))}
              onFocus={() => setFocusField('number')}
              onBlur={() => setFocusField(null)}
              keyboardType="phone-pad"
              style={tw`text-right bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'number'
                  ? 'border-white'
                  : errors.username
                  ? 'border-red-500'
                  : 'border-white/20'
              }`}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 mr-2 text-right`}>كلمة المرور</Text>
            <TextInput
              placeholder="أدخل كلمة المرور"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              style={tw`text-right bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'password' ? 'border-white' : errors.password
                  ? 'border-red-500'
                  : 'border-white/20'
              }`}
            />
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-white mb-1 mr-2 text-right`}>تأكيد كلمة المرور</Text>
            <TextInput
              placeholder="أعد إدخال كلمة المرور"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusField('confirm')}
              onBlur={() => setFocusField(null)}
              style={tw`text-right bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'confirm' ? 'border-white' : errors.confirmPassword
                  ? 'border-red-500'
                  : 'border-white/20'
              }`}
            />
          </View>

          <TouchableOpacity
            onPress={handleSignUp}
            style={tw`bg-white py-3 rounded-xl border border-white/30`}
          >
            <Text style={tw`text-black text-center font-semibold`}>{loading ? `جاري انشاء الحساب` : `إنشاء حساب`}</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row-reverse mt-6`}>
          <Text style={tw`text-white`}>لديك حساب بالفعل؟</Text>
          <TouchableOpacity onPress={() => router.navigate('/Login')}>
            <Text style={tw`text-secondary-500 underline mr-1`}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
