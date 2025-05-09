import { Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useTailwind } from '@/app/hooks/useTailwind'

export default function Index() {
  const tw = useTailwind();
  return (
    <>
      <View style={tw`flex-1 justify-center items-center bg-background-800`}>
        <Redirect href={'/screens/Landing'}/>
      </View>
    </>
  );
}
