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
  const [tick, setTick] = useState(0); // تحديث واحد لكل ثانية

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseTimersRef = useRef<{ [key: string]: number }>({});
  const pausedExercisesRef = useRef<{ [key: string]: boolean }>({});
  const globalTimerRef = useRef<number>(0);

  const getWorkout = async () => {
    try {
      setLoading(true);
      setError(false);
      const username = await AsyncStorage.getItem('username') || '';
      const res = await getUserWorkout(username);
      const workoutData: WorkoutType = res.data.workout;
      setWorkout(workoutData);

      const timers: { [key: string]: number } = {};
      const paused: { [key: string]: boolean } = {};
      workoutData.exercises.forEach((ex) => {
        timers[ex.exerciseId] = 0;
        paused[ex.exerciseId] = false;
      });

      exerciseTimersRef.current = timers;
      pausedExercisesRef.current = paused;
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
      globalTimerRef.current += 1;

      const timers = { ...exerciseTimersRef.current };
      Object.keys(timers).forEach((key) => {
        if (!pausedExercisesRef.current[key]) {
          timers[key] += 1;
        }
      });

      exerciseTimersRef.current = timers;
      setTick(t => t + 1); // يجبر الواجهة على التحديث مرة كل ثانية
    }, 1000);
  };

  const endWorkout = async () => {
    const username = await AsyncStorage.getItem('username') || '';
    skipOrStartNewWorkout(username);
    setStarted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // إعادة تعيين كل المؤقتات
    globalTimerRef.current = 0;
    const timers = exerciseTimersRef.current;
    Object.keys(timers).forEach((key) => {
      timers[key] = 0;
    });

    exerciseTimersRef.current = timers;
    setTick(t => t + 1);
  };

  const toggleExerciseTimer = (exerciseId: string) => {
    pausedExercisesRef.current[exerciseId] = !pausedExercisesRef.current[exerciseId];
    setTick(t => t + 1); // لتحديث الزر والواجهة
  };

  useEffect(() => {
    getWorkout();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
      <View style={tw`flex-1 mt-6 mx-2`}>
        <View style={tw`items-center mb-4`}>
          <Text style={tw`text-white text-xl font-bold`}>{workout?.title}</Text>
          <Text style={tw`text-white/80 text-sm text-center`}>{workout?.description}</Text>
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
              <View
                onTouchEnd={() => {
                  router.navigate({
                    pathname: `/ExercisePage`,
                    params: { exercise: JSON.stringify(exercise) },
                  });
                }}
              >
                <Text style={tw`text-black font-bold mb-2`}>تمرين #{idx + 1}</Text>
                <Text style={tw`text-black font-bold mb-2 text-xl`}>{exercise.exerciseId}</Text>
                {exercise.sets.map((s, i) => (
                  <Text key={i} style={tw`text-black/70 mt-2`}>
                    مجموعة {i + 1} - تكرارات: {s.reps} - راحة: {s.rest}ث
                  </Text>
                ))}
              </View>
              <View style={tw`flex-row justify-between items-center mt-2`}>
                <Text style={tw`text-black text-xl`}>
                  المؤقت: {formatTime(exerciseTimersRef.current[exercise.exerciseId] || 0)}
                </Text>
                <TouchableOpacity
                  style={tw`bg-yellow-500 px-3 py-1 rounded-full`}
                  onPress={() => toggleExerciseTimer(exercise.exerciseId)}
                >
                  <Text style={tw`text-black font-bold`}>
                    {pausedExercisesRef.current[exercise.exerciseId] ? 'تشغيل' : 'إيقاف'}
                  </Text>
                </TouchableOpacity>
              </View>
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
      </View>
    </ScreenWrapper>
  );
}
