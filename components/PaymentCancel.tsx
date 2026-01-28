import React from 'react';
import { View, Text } from 'react-native';

const PaymentCancel = () => {
    return (
        <View className="flex-1 justify-center items-center bg-white p-4">
            <Text className="text-xl font-bold text-red-600 text-center">
                Your Payment has been canceled!
            </Text>
        </View>
    );
}

export default PaymentCancel;
