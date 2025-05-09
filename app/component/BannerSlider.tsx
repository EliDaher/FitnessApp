// components/BannerSlider.tsx
import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Dimensions, View } from 'react-native';
import { useTailwind } from '@/app/hooks/useTailwind';

const bannerImages = [
  require('@/assets/images/banners/banner1.png'),
  require('@/assets/images/banners/banner2.png'),
  require('@/assets/images/banners/banner3.png'),
];

const { width } = Dimensions.get('window');

export default function BannerSlider() {
  const tw = useTailwind();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % bannerImages.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={tw`h-40`}>
      <FlatList
        ref={flatListRef}
        data={bannerImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={{ width, height: 160, resizeMode: 'cover' }} />
        )}
      />
    </View>
  );
}
