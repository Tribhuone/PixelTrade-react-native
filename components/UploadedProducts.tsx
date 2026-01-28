import React from 'react';
import { View, Text } from 'react-native';
import UploadedTable from './UploadedTable';

const UploadedProducts = () => {
    return (
        <View className="w-full border border-gray-300 rounded-lg my-3 p-3 bg-white">
            <Text className="mx-2 text-xl text-green-900 font-bold">My Photo Listings</Text>
            <Text className="mx-2 text-sm my-1 text-gray-600">
                The photos you have uploaded for sale.
            </Text>
            <View className="mt-4 h-[400px]">
                <UploadedTable />
            </View>
        </View>
    );
}

export default UploadedProducts;
