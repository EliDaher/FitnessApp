import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTailwind } from '../hooks/useTailwind';
import ScreenWrapper from './ScreenWrapper';
import { getUserWorkout, skipOrStartNewWorkout } from '../apis/user.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import Loading from '../(screens)/Loading';
import { router } from 'expo-router';

type SetType = {
  reps: number;
  rest: number;
};

type ExerciseType = {
  exerciseId: string;
  exerciseName: string;
  sets: SetType[];
};

type WorkoutType = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  createdAt: string;
  exercises: ExerciseType[];
};

export default function UserWorkout() {
  const tw = useTailwind();
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0); // يجبر الواجهة على التحديث
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const globalTimerRef = useRef<number>(0);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const getWorkout = async () => {
    try {
      setLoading(true);
      setError(false);
      const username = await AsyncStorage.getItem('username') || '';
      const res = await getUserWorkout(username);
      const workoutData: WorkoutType = res.data.workout;
      setWorkout(workoutData);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(true);
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        globalTimerRef.current += 1;
        setTick(t => t + 1); // تحديث الواجهة
      }
    }, 1000);
  };

  const endWorkout = async () => {
    const username = await AsyncStorage.getItem('username') || '';
    skipOrStartNewWorkout(username);
    setStarted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    globalTimerRef.current = 0;
    setTick(t => t + 1);
  };

  useEffect(() => {
    getWorkout();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('حدث خطأ', 'الرجاء المحاولة مرة أخرى');
      router.navigate('/(tabs)/Home');
    }
  }, [error]);

  if (loading) return <Loading />;

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 mt-3 mx-2`}>
        <View style={tw`items-center mb-4`}>

          {/*<Text style={tw`text-white text-xl font-bold mb-1`}>{dayName}</Text>
          <Text style={tw`text-white/80 text-sm text-center mb-2`}>{workout?.description}</Text>*/}


          {started && (
            <TouchableOpacity
              style={tw`bg-yellow-500 px-4 py-2 rounded-full`}
              onPress={() => setPaused(prev => !prev)}
            >
              <Text style={tw`text-black font-bold`}>
                {paused ? 'استئناف المؤقت' : 'إيقاف مؤقت'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* المؤقت العام */}
        <View style={tw`flex-row justify-center items-center mb-4`}>
          <FontAwesome name="clock-o" size={24} color="white" />
          <Text style={tw`text-white text-lg ml-2`}>{formatTime(globalTimerRef.current)}</Text>
        </View>

        <ScrollView style={tw`flex-1 mb-6`}>
          {workout?.exercises.map((exercise, idx) => (
            <View
              key={exercise.exerciseId}
              style={tw`bg-white/60 p-4 mb-3 rounded-xl border border-2 border-white`}
            >
              <TouchableOpacity
                onPress={() => {
                  router.navigate({
                    pathname: `/ExercisePage`,
                    params: { exercise: JSON.stringify(exercise) },
                  });
                }}
              >
                <Text style={tw`text-black font-bold mb-2`}>تمرين #{idx + 1}</Text>
                <Text style={tw`text-black font-bold mb-2 text-xl`}>{exercise.exerciseName}</Text>
                {exercise.sets.map((s, i) => (
                  <Text key={i} style={tw`text-black/70 mt-2`}>
                    مجموعة {i + 1} - تكرارات: {s.reps} - راحة: {s.rest} دقيقة
                  </Text>
                ))}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={tw`bg-secondary-500 py-3 mb-2 rounded-xl`}
          onPress={started ? endWorkout : startWorkout}
        >
          <Text style={tw`text-center text-white text-lg font-bold`}>
            {started ? 'إنهاء التمرين' : 'بدء التمرين'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-yellow-400 py-2 px-2 mb-2 rounded-xl absolute top-0 right-1`}
          onPress={async()=>{
            const username = await AsyncStorage.getItem('username') || '';
            await skipOrStartNewWorkout(username);
            await getWorkout()
            //router.navigate('/Home')
          }}
        >
          <Text style={tw`text-center text-white text-lg font-bold`}>
            تخطي التمرين
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
