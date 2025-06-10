import { View, Text, I18nManager } from 'react-native'
import React, { useEffect } from 'react'
import { useTailwind } from '@/app/hooks/useTailwind'

export default function FTlogo() {
  const tw = useTailwind();

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  }, []);
  return (
    <View style={tw`flex flex-row relative`}>
        <Text style={tw`text-black text-8xl font-bold italic`}>F</Text>
        <Text style={tw`text-black text-8xl font-bold italic`}>T</Text>
    </View>
  )
}