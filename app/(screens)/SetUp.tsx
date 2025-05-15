import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTailwind } from '@/app/hooks/useTailwind'
import { router } from 'expo-router'

export default function SetUp() {

    const tw = useTailwind();
    return (
      <View style={tw`flex flex-col bg-background-500 shadow`}>
          <View style={tw`h-1/2`}>
              <Image
                  source={require('../../assets/images/setUp.png')}
                  style={tw`h-full w-full`}
              />
          </View>
          <View style={tw`h-1/2 flex items-center justify-around`}>
              <Text style={tw`text-4xl text-center text-primary-400`}>
                  Consistency Is {"\n"} The Key To Progress. {"\n"} Don't Give Up!
              </Text>
              <TouchableOpacity
                  onPress={()=>{
                      router.replace('/Gender')
                  }}
              >
                  <Text style={tw`px-20 py-2 text-3xl text-primary-400 border border-primary-400 rounded-3xl`}>Next</Text>
              </TouchableOpacity>
          </View>
      </View>
    )
}