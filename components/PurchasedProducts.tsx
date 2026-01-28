import React from 'react';
import { View, Text } from 'react-native';
import PurchasedTable from "./PurchasedTable";

const PurchasedProducts = () => {
    return (
        <View className="w-full border border-gray-300 rounded-lg my-3 p-3 bg-white">
            <Text className="mx-2 text-xl text-green-900 font-bold">My Purchases</Text>
            <Text className="mx-2 text-sm my-1 text-gray-600">
                Photos you have bought from other creators.
            </Text>
            <View className="mt-4 h-[400px]">
                {/* Fixed height for nested FlatList/ScrollView issues if any, or flex-1 */}
                <PurchasedTable />
            </View>
        </View>
    );
}

export default PurchasedProducts;
