import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable';
import { useTailwind } from '@/app/hooks/useTailwind';
import { LinearGradient } from 'expo-linear-gradient';

type ScreenWrapperProps = {
  children: ReactNode;
  showBack?: boolean;
};

const { width } = Dimensions.get('window');

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, showBack = true }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const tw = useTailwind();

  return (
    <View style={tw`flex-1 bg-black`}>

      {/* خلفية متدرجة */}
      <LinearGradient
        colors={[tw.color('black')!, tw.color('white/1')!, tw.color('white/4')!]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
{/*
      {/* دوائر متحركة شفافة 
      {[...Array(3)].map((_, i) => (
        <Animatable.View
          key={i}
          animation={{
            from: { translateY: 0 },
            to: { translateY: 30 },
          }}
          duration={4000 + i * 1000}
          iterationCount="infinite"
          direction="alternate"
          easing="ease-in-out"
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: tw.color('white/10')!,
            top: i * 150 + 50,
            left: i % 2 === 0 ? -50 : width - 150,
          }}
        />
      ))}

      {/* أيقونات عشوائية تتحرك 
      {[
        { icon: 'fitness', top: '75%', left: '20%' },
        { icon: 'basketball', top: '10%', left: '80%' },
        { icon: 'bicycle', top: '80%', left: '75%' },
        { icon: 'flash', top: '15%', left: '10%' },
      ].map((item, i) => (
        <Animatable.View
          key={i}
          animation={{
            from: { translateY: -10 },
            to: { translateY: 10 },
          }}
          duration={2500 + i * 400}
          iterationCount="infinite"
          direction="alternate"
          easing="ease-in-out"
          style={[
            styles.iconFloat,
            { top: item.top as any, left: item.left as any } // ← 👈 تحويل مؤقت لتجاوز النوعية
          ]}
        >
          <Ionicons style={{ color: tw.color('white/10') }} size={56} name={item.icon as any} />
        </Animatable.View>
      ))}
*/}
      {/* زر الرجوع */}
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={tw.color('white')} />
        </TouchableOpacity>
      )}

      {/* محتوى الصفحة مع دخول متدرج */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={tw`flex-1`}
      >
        {children}
      </Animatable.View>
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
  iconFloat: {
    position: 'absolute',
  } as ViewStyle,
});
