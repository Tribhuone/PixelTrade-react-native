import React from 'react';
import { View } from 'react-native';
// If using Reanimated or Moti for skeletons, import here. For now, simple static pulse-like blocks.

const SingleImageSkeleton = () => {
    return (
        <View className="flex-col pb-6 bg-white min-h-screen">

            {/* Image skeleton */}
            <View className="w-full h-[300px] bg-gray-200" />

            {/* Info skeleton */}
            <View className="p-4 gap-4">

                {/* Title + Username */}
                <View className="h-8 w-2/3 bg-gray-200 rounded-md" />
                <View className="h-4 w-1/3 bg-gray-200 rounded-md" />

                {/* Description */}
                <View className="h-20 w-full bg-gray-200 rounded-md" />

                {/* Price + Add to Cart */}
                <View className="flex-row justify-between items-center w-full gap-4 mt-2">
                    <View className="h-8 w-20 bg-gray-200 rounded-md" />
                    <View className="h-10 w-32 bg-gray-200 rounded-md" />
                </View>

                {/* Keywords */}
                <View className="flex-row flex-wrap gap-2 mt-4">
                    <View className="h-6 w-12 bg-gray-200 rounded-full" />
                    <View className="h-6 w-16 bg-gray-200 rounded-full" />
                    <View className="h-6 w-14 bg-gray-200 rounded-full" />
                    <View className="h-6 w-20 bg-gray-200 rounded-full" />
                </View>
            </View>
        </View>
    );
};

export default SingleImageSkeleton;
