import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTailwind } from '@/app/hooks/useTailwind';
import React, { useState, useContext } from 'react';
import FTlogo from '../component/FTlogo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { login } from '../apis/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/context/AuthContext';

export default function Login() {
  const { authLogin: contextLogin } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState<'username' | 'password' | null>(null);
  const tw = useTailwind();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      router.navigate(`/(tabs)/Home`);
    } catch (error: any) {
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

        <View style={tw`w-full bg-white/5 border border-white/10 rounded-2xl mt-10 py-8 px-4`}>
          <Text style={tw`text-white text-xl font-semibold text-center mb-4`}>Login</Text>

          {/* Username */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 ml-2`}>Username</Text>
            <TextInput
              placeholder="Enter your username"
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
            <Text style={tw`text-white mb-1 ml-2`}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              style={tw`bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'password' ? 'border-white' : 'border-white/20'
              }`}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={tw`bg-white py-3 rounded-xl border border-white/30`}
          >
            <Text style={tw`text-black text-center font-semibold`}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={tw`flex-row mt-6`}>
          <Text style={tw`text-white`}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/screens/SignUp')}>
            <Text style={tw`text-secondary-500 underline ml-1`}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}
