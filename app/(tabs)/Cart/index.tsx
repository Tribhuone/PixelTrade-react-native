
import { View, Text, ScrollView, Image, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeCart } from "@/store/slices/cartSlice";
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

export default function CartScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector((state: any) => state.cart);
    const user = useSelector((state: any) => state.user);
    const cartList = cartItems.cart || [];

    const totalPrice = cartList.reduce((acc: number, item: any) => {
        return acc + Number(item.price);
    }, 0);

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    const removeFromCart = (index: number) => {
        dispatch(removeCart(index));
    }

    const handleCheckout = async () => {
        if (!user.token) {
            Alert.alert("Error", "Please login to checkout", [
                { text: "Login", onPress: () => router.push("/auth/login") },
                { text: "Cancel", style: "cancel" }
            ]);
            return;
        }

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_ORDER_API_URL}/api/order/payment-checkout`,
                cartList,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const session = response.data;
            if (session.url) {
                await WebBrowser.openBrowserAsync(session.url);
            } else {
                console.error("Session URL missing:", session);
                Alert.alert("Error", "Could not initiate payment. Server response invalid.");
            }
        } catch (error: any) {
            console.error("Checkout Error:", error);
            const msg = error.response?.data?.message || "Checkout failed. Please try again.";
            Alert.alert("Error", msg);
        }
    }

    if (cartList.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-white border border-red-200">
                <FontAwesome6 name="cart-plus" size={90} color="#1b641bff" className="w-[30%]" />
                <Text className="text-xl font-semibold text-gray-400 my-3">Your cart is empty!</Text>
                <Pressable onPress={() => router.replace("/(tabs)/Home")} className="mt-4 px-4 py-2 navigate-btn rounded-lg">
                    <Text className="text-white font-semibold">Go Shopping</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1 p-4 mb-20">
                <Text className="text-2xl font-bold mb-4">Your Shopping Cart</Text>

                {cartList.map((item: any, index: number) => (
                    <View key={index} className="flex-row items-center p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <Image
                            source={{ uri: item.path || item.imagePath }}
                            className="w-20 h-20 rounded-lg bg-gray-200"
                            resizeMode="cover"
                        />
                        <View className="flex-1 ml-3 justify-between h-20 py-1">
                            <View>
                                <Text className="font-semibold text-base" numberOfLines={1}>{item.title}</Text>
                                <Text className="text-sm text-gray-500">{item.userName}</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-semibold">₹{item.price}</Text>
                                <Pressable onPress={() => removeFromCart(index)}>
                                    <Text className="text-red-500 font-medium">Remove</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}

                <Pressable onPress={handleClearCart} className="border border-red-200 px-2 -py-2 rounded-lg w-3/3.9 mx-auto" >
                    <Text className="text-red-500 text-center mt-2 mb-10">Clear Cart</Text>
                </Pressable>
            </ScrollView>
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg mb-20">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-lg font-semibold">Total</Text>
                    <Text className="text-lg font-bold">₹{totalPrice.toFixed(2)}</Text>
                </View>
                <Pressable
                    onPress={handleCheckout}
                    className="bg-amber-400 py-3 rounded-lg active:bg-amber-500"
                >
                    <Text className="text-center font-bold text-lg">Proceed to Checkout</Text>
                </Pressable>
            </View>

        </View>
    );
}
