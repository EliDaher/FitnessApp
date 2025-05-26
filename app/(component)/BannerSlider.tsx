// components/BannerSlider.tsx
import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Image, Dimensions, View } from 'react-native';
import { useTailwind } from '@/app/hooks/useTailwind';

const bannerImages = [
  require('@/assets/images/banners/banner4.png'),
  require('@/assets/images/banners/fitnessTime.png'),
];

const { width } = Dimensions.get('window');

export default function BannerSlider() {
  const tw = useTailwind();
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % bannerImages.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={tw`h-60 relative`}>
      <FlatList
        ref={flatListRef}
        data={bannerImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={0}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{
              width,
              height: 240,
              resizeMode: 'cover',
            }}
          />
        )}
      />
      <View style={tw`absolute bottom-2 left-0 right-0 flex-row justify-center`}>
        {bannerImages.map((_, index) => (
          <View
            key={index}
            style={tw`mx-1 w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
