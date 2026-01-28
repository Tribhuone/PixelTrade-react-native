import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearCart, removeCart } from '../store/slices/cartSlice'; // Verify path
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'; // Using FontAwesome6 for trash-can if available, or FontAwesome

const CartOnProduct = ({ cartItem }: { cartItem: any[] }) => {
    const dispatch = useDispatch();

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    const removeFromCart = (index: number) => {
        dispatch(removeCart(index));
    }

    return (
        <View className="flex-1 w-full rounded-xl border border-gray-300 p-2 my-5 mx-auto bg-white">
            {/* Cart items container */}
            <ScrollView className="w-full h-[50vh]" nestedScrollEnabled>
                {cartItem.map((item, index) => (
                    <View
                        className="flex-col sm:flex-row p-3 w-[97%] border border-gray-200 rounded-lg shadow-sm mb-3 mx-auto"
                        key={index}
                    >
                        {/* Content Wrapper */}
                        <View className="flex-row w-full">
                            {/* Image */}
                            <Image
                                source={{ uri: item.path || item.imagePath }} // handle path variance
                                className="w-24 h-20 rounded-lg bg-gray-200"
                                resizeMode="cover"
                            />

                            {/* Details */}
                            <View className="flex-1 ml-3 justify-between">
                                <View>
                                    <Text className="font-semibold text-black text-base" numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                                        {item.userName}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mt-2">
                                    <Text className="font-semibold text-sm">₹{item.price}</Text>

                                    <TouchableOpacity
                                        onPress={() => removeFromCart(index)}
                                        className="p-2"
                                    >
                                        <FontAwesome6 name="trash-can" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View className="h-[1px] bg-gray-200 w-full my-2" />

            {/* Clear Cart button */}
            <TouchableOpacity
                onPress={handleClearCart}
                className="w-[150px] py-3 border border-gray-400 rounded-lg self-center mt-2 items-center active:bg-green-700 active:border-green-700"
            >
                <Text className="text-black font-medium text-sm active:text-white">
                    Clear my cart!
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default CartOnProduct;
