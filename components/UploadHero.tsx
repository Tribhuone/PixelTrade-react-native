import React from 'react';
import { View, Text } from 'react-native';

const UploadHero = () => {
    return (
        <View className="justify-center items-center w-full my-4 px-3">
            <View className="items-center w-[95%] sm:w-[80%]">
                {/* Title */}
                <Text className="text-2xl font-medium text-center text-black">
                    Share Your Vision
                </Text>

                {/* Subtitle */}
                <Text className="text-sm mt-2 text-center text-gray-700">
                    Upload your photo and fill out the details to list it on the marketplace.
                </Text>
            </View>
        </View>
    );
};

export default UploadHero;
