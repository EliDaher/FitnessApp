import { View, Text } from 'react-native'
import React from 'react'
import ScreenWrapper from '../(component)/ScreenWrapper'
import { useTailwind } from '../hooks/useTailwind'

export default function WorkoutClasses() {

    const tw = useTailwind()

    return (
        <ScreenWrapper>
            <View style={tw`flex-1 items-center justify-center`}>

                <Text style={tw`text-white text-3xl font-bold`}>قريبا ...</Text>

            </View>
        </ScreenWrapper>
    )
}