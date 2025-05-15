import { useEffect } from "react";
import { Text, View, I18nManager } from "react-native";
import { Redirect } from "expo-router";
import { useTailwind } from '@/app/hooks/useTailwind';

export default function Index() {
  const tw = useTailwind();

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
  }, []);

  return (
    <View style={tw`flex-1 justify-center items-center bg-background-800`}>
      <Redirect href={'/Landing'} />
    </View>
  );
}
