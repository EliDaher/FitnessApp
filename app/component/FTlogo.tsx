import { View, Text } from 'react-native'
import React from 'react'
import { useTailwind } from '@/app/hooks/useTailwind'

export default function FTlogo() {
  const tw = useTailwind();
  return (
    <View style={tw`flex flex-row relative`}>
        <Text style={tw`text-white text-8xl font-bold italic animate-pulse`}>F</Text>
        <Text style={tw`text-white text-8xl font-bold italic`}>T</Text>
    </View>
  )
}