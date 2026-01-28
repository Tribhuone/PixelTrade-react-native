import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const CartOnEmpty = () => {
    const router = useRouter();

    const handleBrowsing = () => {
        router.push("/");
    }

    return (
        <View className="w-[90%] rounded-xl h-[60vh] border border-gray-200 p-8 my-5 mx-auto justify-center items-center bg-white">
            <FontAwesome name="cart-plus" size={72} color="black" />

            <Text className="text-xl font-semibold my-4 text-black text-center">
                Your cart is empty.
            </Text>
            <Text className="text-gray-600 text-center mb-6">
                Looks like you haven't added any photos yet.
            </Text>

            <TouchableOpacity
                className="bg-green-800 py-2 px-4 rounded-lg active:bg-green-900"
                onPress={handleBrowsing}
            >
                <Text className="text-white font-semibold text-base">
                    Start Browsing
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default CartOnEmpty;
