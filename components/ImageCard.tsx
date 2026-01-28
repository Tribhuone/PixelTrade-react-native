import React from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { updateCart } from "../store/slices/cartSlice";
import Feather from '@expo/vector-icons/Feather';

const ImageCard = ({ item }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector((state) => state.cart);

    const checkAlreadyInCart = (item) => {
        return cartItems.cart.some((cartItem) => cartItem._id === item._id);
    };

    const handleAddToCart = (item) => {
        if (checkAlreadyInCart(item)) {
            Alert.alert("Cart", "This item is already in your cart!");
        } else {
            dispatch(updateCart(item));
            Alert.alert("Success", "Picture added to cart");
        }
    };

    return (
        <Pressable
            onPress={() => router.push(`/img/${item._id}`)}
            className="w-[95%] sm:w-[45%] md:w-[45%] m-2 border border-gray-300 rounded-xl overflow-hidden bg-white"
        >
            <View className="w-full h-[250px] bg-gray-200">
                <Image
                    source={{ uri: item.path }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>

            <View className="p-3">
                <Text className="text-lg font-semibold mb-1 text-primary">
                    {item.title}
                </Text>

                <Text className="text-sm text-gray-500 mb-2">
                    {item.userName}
                </Text>

                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-lg font-semibold">
                        ₹ {item.price}
                    </Text>

                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                        }}
                        className="px-3 py-2 rounded-md btn-primary w-[80px] justify-center items-center"
                    >
                        <Text className="text-primary text-sm font-medium">
                            Add <Feather name="shopping-cart" size={13} />
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
};

export default ImageCard;
