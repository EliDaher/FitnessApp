import { View, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ScreenWrapper from '../(component)/ScreenWrapper'
import { useTailwind } from '../hooks/useTailwind'
import { AuthContext } from '@/context/AuthContext'
import { getNutritionProgramById } from '../apis/user.api'

interface FoodItem {
  food: string;
  quantity: string;
  unit: string;
}

interface MealItem {
  name: string;
  items: FoodItem[];
}

interface NutritionData {
  title: string;
  description: string;
  calories: string;
  price: string;
  createdAt: string;
  meals: MealItem[];
}

export default function DietPage() {
  const tw = useTailwind()
  const { user } = useContext(AuthContext)
  const [nutrition, setNutrition] = useState<NutritionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getNutrition = async () => {
      if (!user?.nutrition || user.nutrition.length === 0) {
        setLoading(false)
        return
      }

      try {
        const nutId = user.nutrition[0].id
        const res = await getNutritionProgramById(nutId)
        setNutrition(res.data.data)
      } catch (error) {
        console.error('Failed to fetch nutrition data:', error)
      } finally {
        setLoading(false)
      }
    }

    getNutrition()
  }, [])

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-white text-lg`}>جاري التحميل...</Text>
        </View>
      </ScreenWrapper>
    )
  }

  if (!nutrition) {
    return (
      <ScreenWrapper>
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-white text-xl font-bold`}>راجع المدرب للمزيد من المعلومات</Text>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <ScrollView style={tw`px-4 pt-12`}>

        <View style={tw`bg-white/80 rounded-2xl p-4 mb-6`}>
          <Text style={tw`text-black text-2xl font-bold mb-2 text-right`}>
            {nutrition.title}
          </Text>

          <Text style={tw`text-black/70 mb-1 text-lg text-right`}>الوصف: {nutrition.description}</Text>
          <Text style={tw`text-black/70 mb-1 text-lg text-right`}>السعرات الحرارية: {nutrition.calories}</Text>
          <Text style={tw`text-black/70 mb-1 text-lg text-right`}>السعر: {nutrition.price} ل.س</Text>
          <Text style={tw`text-black/50 mt-2 text-lg text-right`}>
            🗓 التاريخ: {new Date(nutrition.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={tw`text-white text-2xl font-semibold mb-3 text-right`}>🍱 الوجبات:</Text>

        {nutrition.meals.map((meal, index) => (
          <View key={index} style={tw`bg-white/70 rounded-xl p-4 mb-4`}>
            <Text style={tw`text-black text-xl font-semibold mb-2 text-right`}>
              🍽 {meal.name}
            </Text>

            {meal.items.map((item, idx) => (
              <Text key={idx} style={tw`text-black/70 text-base text-lg ml-2 text-right`}>
                • {item.food} - {item.quantity} {item.unit}
              </Text>
            ))}
          </View>
        ))}

      </ScrollView>
    </ScreenWrapper>
  )
}
