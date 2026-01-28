
import React from "react";
import { View } from "react-native";

const CardSkeleton = () => {
    return (
        <View className="w-[95%] sm:w-[45%] md:w-[45%] m-2 border border-gray-200 rounded-xl overflow-hidden bg-white">

            {/* Image skeleton */}
            <View className="w-full h-[250px] bg-gray-300 animate-pulse" />

            {/* Text skeleton */}
            <View className="p-3 space-y-3">
                <View className="h-5 w-[70%] bg-gray-300 rounded-md animate-pulse" />
                <View className="h-4 w-[40%] bg-gray-300 rounded-md animate-pulse" />

                <View className="flex-row justify-between items-center mt-4">
                    <View className="h-5 w-[25%] bg-gray-300 rounded-md animate-pulse" />
                    <View className="h-9 w-[80px] bg-gray-300 rounded-md animate-pulse" />
                </View>
            </View>
        </View>
    );
};

export default CardSkeleton;
