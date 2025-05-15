import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import React, { useState, useContext } from 'react';
import FTlogo from '../(component)/FTlogo';
import { useTailwind } from '@/app/hooks/useTailwind';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signup } from '../apis/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("eeli56315@gmail.com")
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusField, setFocusField] = useState< 'confirm' | 'email' | 'fullName' | 'username' | 'password' | null>(null);
  const { toggleMode } = useTheme();
  const tw = useTailwind();

  const handleSignUp = async () => {
       router.navigate('/Gender')

       try {
        const response = await signup(
          fullName,          // fullName
          username,          // username
          email,    // email
          password,             // password
          confirmPassword              // confirmPassword
        );

        
        await AsyncStorage.setItem('username', username); 
        await AsyncStorage.setItem('password', password);

        router.navigate('/Gender')
        console.log("User signed up:", response.data);

      } catch (error: any) {
        console.log("Signup error:", error.response?.data?.error || error.message);
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

      <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center px-6`}>
        <FTlogo />

        <View style={tw`w-full bg-white/5 border border-white/10 rounded-2xl mt-10 py-8 px-4`}>
          <Text style={tw`text-white text-xl font-semibold text-center mb-4`}>Sign Up</Text>

          {/* fullName */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 ml-2`}>Full Name / الاسم كامل</Text>
            <TextInput
              placeholder="Choose a fullName"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusField('fullName')}
              onBlur={() => setFocusField(null)}
              style={tw`bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'fullName' ? 'border-white' : 'border-white/20'
              }`}
            />
          </View>
          {/* email 
          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 ml-2`}>email</Text>
            <TextInput
              placeholder="Choose a email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField(null)}
              style={tw`bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'email' ? 'border-white' : 'border-white/20'
              }`}
            />
          </View>*/}
          
          {/* Username */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 ml-2`}>Username / اسم المستخدم</Text>
            <TextInput
              placeholder="Choose a username"
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
          <View style={tw`mb-4`}>
            <Text style={tw`text-white mb-1 ml-2`}>Password / كلمة المرور</Text>
            <TextInput
              placeholder="Enter a password"
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

          {/* Confirm Password */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-white mb-1 ml-2`}>Confirm Password / تأكيد كلمة المرور</Text>
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusField('confirm')}
              onBlur={() => setFocusField(null)}
              style={tw`bg-white/10 text-white px-4 py-3 rounded-xl border ${
                focusField === 'confirm' ? 'border-white' : 'border-white/20'
              }`}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={tw`bg-white py-3 rounded-xl border border-white/30`}
          >
            <Text style={tw`text-black text-center font-semibold`}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Login Redirect */}
        <View style={tw`flex-row mt-6`}>
          <Text style={tw`text-white`}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/Login')}>
            <Text style={tw`text-secondary-500 underline ml-1`}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
