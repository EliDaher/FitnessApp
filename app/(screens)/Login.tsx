import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, I18nManager } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTailwind } from '@/app/hooks/useTailwind';
import React, { useState, useContext, useEffect } from 'react';
import FTlogo from '../(component)/FTlogo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { login } from '../apis/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/context/AuthContext';

export default function Login() {
  const { authLogin } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState<'username' | 'password' | null>(null);
  const tw = useTailwind();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  
    useEffect(() => {
      // تفعيل دعم RTL
      if (!I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        // من الأفضل إعادة تشغيل التطبيق إذا تغيّر الاتجاه
      }
    }, []);

  const handleLogin = async () => {
    try {
      setError(false)
      setLoading(true)
      const response = await login(username, password);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      authLogin(response.data.userData)
      router.navigate(`/(tabs)/Home`);
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      setError(true)
      if(error.message.includes('Network Error')){ alert('الرجاء التأكد من اتصالك بالانترنت'); setError(false) }
      console.log("Login error:", error.response?.data?.error || error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-black`}
    >
      {/* Animated Icons */}
      {[
        { icon: 'fitness', top: '75%', left: '20%' },
        { icon: 'basketball', top: '10%', left: '80%' },
        { icon: 'bicycle', top: '80%', left: '75%' },
        { icon: 'flash', top: '15%', left: '10%' },
      ].map((item, i) => (
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

      <View style={tw`flex-1 justify-center items-center px-6`}>
        <FTlogo />

        <View style={tw`w-full ${error ? 'bg-red-100' : 'bg-white/5'} border border-white/10 rounded-2xl mt-10 py-8 px-4`}>
          {error && <Text style={tw`text-red-500 -mt-2 rounded text-lg bg-red-100 font-semibold text-center mb-4`}>حدث خطأ الرجاء التأكد من المدخلات</Text>}
          <Text style={tw`text-white text-xl font-semibold text-center mb-4`}>تسجيل الدخول</Text>

          {/* Username */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-white text-right text-lg mb-1 mr-2`}>الاسم الثلاثي</Text>
            <TextInput
              placeholder="ادخل الاسم الثلاثي"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusField('username')}
              onBlur={() => setFocusField(null)}
              style={tw`bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'username' ? 'border-white' : 'border-white/20'
              }`}
            />
          </View>

          {/* Password */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-white text-right text-lg mb-1 mr-2`}>كلمة المرور</Text>
            <TextInput
              placeholder="ادخل كلمة المرور الخاصة بك"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              style={tw`bg-white/10 text-white text-right px-4 py-3 rounded-xl border ${
                focusField === 'password' ? 'border-white' : 'border-white/20'
              }`}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={tw`bg-white py-3 rounded-xl border border-white/30`}
          >
            <Text style={tw`text-black text-center font-semibold`}>{loading ? "جاري تسجيل الدخول ..." : "تسجيل الدخول"}</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={tw`flex-row mt-6`}>
          <TouchableOpacity onPress={() => router.navigate('/SignUp')}>
            <Text style={tw`text-secondary-500 underline ml-1`}>حساب جديد</Text>
          </TouchableOpacity>
          <Text style={tw`text-white`}>لا تملك حسابا ؟</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}
