import React from 'react';
import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Hero = () => {
    return (
        <View className="m-4 px-3">
            <View className="flex flex-row items-center gap-3" >
                <AntDesign name="camera" size={28} color="#256925ff" />
                <Text className='text-3xl font-medium leading-snug text-primary'>Pixel Trade</Text>
            </View>

            <View className="flex justify-center items-center h-auto min-h-[20vh]">
                <View className="w-full items-center">
                    <Text className="text-2xl font-medium leading-snug text-center text-primary">
                        Discover Your Next Masterpiece
                    </Text>
                    <Text className="text-base mt-2 text-center little-text">
                        Explore a universe of stunning visuals. High-quality, royalty-free photos from the world's most talented photographers.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Hero;
