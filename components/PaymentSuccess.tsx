import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice'; // Verify path
import axios from "axios";
// import Navbar from './Navbar'; // Not typically needed in RN screens if using navigation headers
// import Footer from './Footer'; // Can be added if page layout requires it

const PaymentSuccess = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: any) => state.cart.cart);
    const authorize = useSelector((state: any) => state.user);

    useEffect(() => {
        const dataStore = async () => {
            const token = authorize.token;
            const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

            try {
                await axios.post(`${API_URL}/api/order/ordered-products`,
                    products,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                // console.log(res.data.message);
            } catch (er) {
                console.log(er);
            }
        }

        if (products.length > 0) {
            dataStore();
            dispatch(clearCart());
        }
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-white p-4">
            <Text className="text-2xl font-bold text-green-700 text-center">
                Your Payment Successfully Completed!
            </Text>
        </View>
    );
}

export default PaymentSuccess;
