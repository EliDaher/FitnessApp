import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from './ScreenWrapper'
import { useTailwind } from '../hooks/useTailwind'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import { getExerciseByName } from '../apis/exercise.api'
import Loading from '../(screens)/Loading'

type Exercise = {
  bodyPart: string;
  category: string;
  commonMistakes: string;
  description: string;
  difficulty: string;
  exerciseName: string;
  imageUrl: string;
};

type SetType = {
  reps: number;
  rest: number;
};

type workoutExercise = {
  exerciseId: string;
  sets: SetType[];
};

export default function ExercisePage() {
  const tw = useTailwind()
  const { exercise } = useLocalSearchParams()
  const [exerciseData, setExerciseData] = useState<Exercise>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const parsed = JSON.parse(exercise as string)

        // إذا كانت البيانات كاملة، لا داعي لجلبها من الـ API
        if (parsed.bodyPart && parsed.exerciseName && parsed.imageUrl) {
          setExerciseData(parsed)
          setLoading(false)
        } 
        // إذا كانت تحتوي فقط على exerciseId
        else if (parsed.exerciseId) {
          const res = await getExerciseByName(parsed.exerciseId)
          setExerciseData(res.data.exercise)
          setLoading(false)
        } else {
          console.warn("بيانات التمرين غير صالحة")
          setLoading(false)
        }
      } catch (err) {
        console.error("فشل في تحليل بيانات التمرين:", err)
        setLoading(false)
      }
    }

    loadExercise()
  }, [])

  if (loading || !exerciseData) {
    return <Loading />
  }

  return (
    <ScreenWrapper>
      <View style={tw`mb-4 mt-9 mx-2 border border-white/30 rounded-xl p-4 bg-white/5 flex-1`}>
        <Text style={tw`text-white text-2xl text-center mt-2 mb-4 font-bold`}>
          {exerciseData.exerciseName}
        </Text>
        <ScrollView>
          <Image
            source={{ uri: exerciseData.imageUrl }}
            style={tw`h-68 w-full rounded-lg mb-2 shadow border border-white/20`}
            resizeMode="contain"
          />
          <Text style={tw`text-white text-right text-base bg-white/10 px-2 py-3 border border-white/50 rounded-lg mr-1 mb-4`}>
            <Text style={tw`font-bold`}>التصنيف: </Text>{exerciseData.category}
          </Text>
          <Text style={tw`text-white text-right text-base bg-white/10 px-2 py-3 border border-white/50 rounded-lg mr-1 mb-4`}>
            <Text style={tw`font-bold`}>الصعوبة: </Text>{exerciseData.difficulty}
          </Text>
          <Text style={tw`text-white text-right text-base bg-white/10 px-2 py-3 border border-white/50 rounded-lg mr-1 mb-4`}>
            <Text style={tw`font-bold`}>الجزء المستهدف: </Text>{exerciseData.bodyPart}
          </Text>
          <Text style={tw`text-white text-right text-base bg-white/10 px-2 py-3 border border-white/50 rounded-lg mr-1 mb-4`}>
            <Text style={tw`font-bold`}>الوصف: </Text>{exerciseData.description}
          </Text>
          <Text style={tw`text-white text-right text-base bg-white/10 px-2 py-3 border border-white/50 rounded-lg mr-1`}>
            <Text style={tw`font-bold`}>أخطاء شائعة: </Text>{exerciseData.commonMistakes}
          </Text>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}
