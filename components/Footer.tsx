import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign'; // Using AntDesign as substitute for fa-regular fa-camera

const Footer = () => {
    return (
        <View className="bg-gray-200 w-full p-4 flex flex-col justify-between items-center gap-4">

            {/* Logo Section */}
            <View className="flex flex-row items-center gap-2">
                <AntDesign name="camera" size={24} color="black" />
                <Text className="text-xl font-medium text-black">PixelTrade</Text>
            </View>

            {/* Links + Copyright */}
            <View className="flex flex-col items-center gap-2 w-full">

                {/* Links */}
                <View className="flex flex-row flex-wrap justify-center gap-4">
                    <TouchableOpacity onPress={() => { }}>
                        <Text className="text-blue-600 underline">About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <Text className="text-blue-600 underline">Terms of Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <Text className="text-blue-600 underline">Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <Text className="text-blue-600 underline">Contact</Text>
                    </TouchableOpacity>
                </View>

                {/* Copyright */}
                <Text className="text-xs text-gray-600 mt-2 text-center">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </Text>
            </View>
        </View>
    );
};

export default Footer;
