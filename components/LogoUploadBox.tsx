import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const LogoUploadBox = () => {
    const router = useRouter();
    // Use 'any' for state type for now, or define a RootState type
    const authentication = useSelector((state: any) => state.user);
    const isLoggedIn = authentication?.isAuthenticated;

    const handleUploadBtn = () => {
        if (isLoggedIn) {
            router.push("/(tabs)/Upload"); // Adjust path based on your routing
        } else {
            Alert.alert("Notice", "First you have to login");
            router.push("/auth/login");
        }
    }

    return (
        <View className="flex-row justify-between items-center w-full px-2">

            <TouchableOpacity
                className="flex-row items-center gap-2"
                onPress={() => router.push("/")}
            >
                <AntDesign name="camera" size={24} color="black" />
                <Text className="text-xl font-bold text-black">PixelTrade</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-row items-center bg-gray-100 p-2 rounded-md active:bg-amber-300"
                onPress={handleUploadBtn}
            >
                <FontAwesome name="upload" size={16} color="black" />
                <Text className="ml-2 font-medium">Upload</Text>
            </TouchableOpacity>

        </View>
    );
}

export default LogoUploadBox;
