import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTailwind } from '../hooks/useTailwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllExercises } from '../apis/exercise.api';
import ScreenWrapper from '../component/ScreenWrapper';
import { router } from 'expo-router';

type Exercise = {
  bodyPart: string;
  category: string;
  commonMistakes: string;
  description: string;
  difficulty: string;
  exerciseName: string;
  imageUrl: string;
};

const muscleGroups = ["الكل", "صدر", "ظهر", "ارجل امامي", "ارجل خلفي", "باي سيبس", "تراي سيبس", "كتف", "معدة", "ترابيز", "ورك", "بطات", "سواعد", "كارديو"]; 

const muscleImages: { [key: string]: any } = {
  "صدر": require("@/assets/images/muscles/chest.png"),
  "ظهر": require("@/assets/images/muscles/back.png"),
  "ارجل امامي": require("@/assets/images/muscles/quadrice.png"),
  "ارجل خلفي": require("@/assets/images/muscles/hamstring.png"),
  "باي سيبس": require("@/assets/images/muscles/biceps.png"), 
  "تراي سيبس": require("@/assets/images/muscles/triceps.png"),
  "كتف": require("@/assets/images/muscles/shoulder.png"),
  "معدة": require("@/assets/images/muscles/abs.png"),
  "ترابيز": require("@/assets/images/muscles/trapez.png"),
  //"ورك": require("@/assets/images/muscles/deltoid.png"),
  "بطات": require("@/assets/images/muscles/calf2.png"),
  "سواعد": require("@/assets/images/muscles/wirst.png"),
  "كارديو": require("@/assets/images/muscles/heart.png"),
  "الكل": require("@/assets/images/muscles/muscles.png"),
};

export default function Exercises() {
  const tw = useTailwind();
  const [exercisesData, setExerciseData] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState("الكل");
  const [search, setSearch] = useState("");

  const filteredExercises = exercisesData.filter(
    ex =>
      (selectedMuscle === "الكل" || ex.bodyPart.trim() === selectedMuscle) &&
      ex.exerciseName.includes(search)
  );

  const getExercises = async () => {
    try {
      const res = await getAllExercises();
      const temp = res.data.exercises;
      const formatted = Object.values(temp);  // تصحيح مهم هنا
      setExerciseData(formatted as Exercise[]);
    } catch (error) {
      console.error("فشل تحميل التمارين:", error);
      setExerciseData([]);
    }
  };

  useEffect(() => {
    getExercises();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView style={tw`flex-1 mt-6`}>
        <View style={tw`p-4`}>
          {/* مربع البحث */}
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-4 text-white`}
            placeholder="ابحث عن تمرين..."
            onChangeText={setSearch}
            value={search}
            placeholderTextColor="gray"
          />

          {/* شريط العضلات */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
            {muscleGroups.map((muscle) => (
              <TouchableOpacity
                key={muscle}
                onPress={() => setSelectedMuscle(muscle)}
                style={tw`mr-3 items-center`}
              >
                <Image
                  source={muscleImages[muscle]}
                  style={tw`w-16 h-16 rounded-full ${selectedMuscle === muscle ? 'border-4 border-secondary-500' : 'border border-gray-300'}`}
                />
                <Text style={tw`text-xs text-white mt-1 pb-3`}>{muscle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* عرض التمارين */}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.exerciseName}
            renderItem={({ item }) => (
              <View style={tw`mb-4 border border-white/20 rounded-xl p-4 bg-white/10`}
                onTouchEnd={()=>{
                  router.navigate({
                    pathname: `/component/ExercisePage`,
                    params: { exercise: JSON.stringify(item) }
                  })
                }}  
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={tw`h-40 w-full rounded-lg mb-2 shadow border border-white/20`}
                  resizeMode="stretch"
                />
                <Text style={tw`text-white text-lg font-bold text-right`}>{item.exerciseName}</Text>
                <Text style={tw`text-white text-right`}>{item.category}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={tw`text-white text-center mt-10`}>لا توجد تمارين مطابقة</Text>
            }
            contentContainerStyle={tw`pb-40`}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
