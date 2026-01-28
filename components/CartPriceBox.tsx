import React from 'react';
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import axios from "axios";

const CartPriceBox = () => {
    const cartItems = useSelector((state: any) => state.cart);
    const authorize = useSelector((state: any) => state.user);
    const cartItem = cartItems.cart;

    const totalPrice = cartItem.reduce((acc: number, item: any) => {
        return acc + item.price;
    }, 0);

    const handlePayment = async () => {
        const token = authorize.token;
        // const stripe = await loadStripe(import.meta.env.STRIPE_LOAD); // Web specific

        try {
            const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

            const response = await axios.post(`${API_URL}/api/order/payment-checkout`,
                cartItem,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const session = response.data;

            // On React Native, we can't use stripe.redirectToCheckout.
            // If the backend returns a session URL, we can open it.
            if (session.url) {
                await Linking.openURL(session.url);
            } else if (session.id) {
                // Warning: This assumes a standard Stripe Checkout setup where you might construct the URL yourself or the backend should return the url.
                // For now, we'll alert.
                Alert.alert("Checkout", "Checkout session created. ID: " + session.id);
            } else {
                Alert.alert("Error", "Invalid session data received");
            }

        } catch (err) {
            console.log("Error during checkout", err);
            Alert.alert("Error", "Checkout failed");
        }
    }

    return (
        <View className="w-[95%] sm:w-[80%] border border-gray-200 mx-auto p-4 my-5 bg-white rounded-lg shadow-md">
            <Text className="text-xl font-semibold my-3 text-center">
                Order Summary
            </Text>
            <View className="h-[1px] bg-gray-200 w-full mb-4" />

            <View className="flex-row justify-between items-center my-4">
                <Text className="text-lg text-black">Total</Text>
                <Text className="font-medium text-lg text-black">
                    {totalPrice.toFixed(2)}
                </Text>
            </View>

            <TouchableOpacity
                className="w-full py-3 bg-amber-300 rounded-lg items-center active:bg-amber-400"
                onPress={handlePayment}
            >
                <Text className="text-black font-medium text-base">
                    Proceed to Checkout
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default CartPriceBox;
