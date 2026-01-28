
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateUser } from "@/store/slices/userSlice";

export default function EditProfileScreen() {

    const router = useRouter();
    const authorize = useSelector((state) => state.user);
    const [name, setName] = useState(authorize.user?.name || "");
    const [email, setEmail] = useState(authorize.user?.email || "");
    const [phone, setPhone] = useState(authorize.user?.phone || "");

    // const [password, setPassword] = useState("password");
    // const [secure, setSecure] = useState(true);

    const dispatch = useDispatch();

    const handleUpdateProfile = async () => {
        try {
            const token = authorize.token; // assuming token is stored in redux

            const res = await axios.patch(
                `${process.env.EXPO_PUBLIC_USER_API_URL}/api/user/update-profile`,
                {
                    name,
                    email,
                    phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                dispatch(updateUser({
                    user: res.data.user,
                    token: authorize.token, // keep existing token
                }));
                Alert.alert("Success", "Profile updated successfully");
                router.back();
            }

        } catch (error) {
            console.log(error.response?.data || error.message);
            Alert.alert(
                "Error",
                error.response?.data?.message || "Something went wrong"
            );
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-white px-5">
            {/* Header */}
            <View className="flex-row items-center justify-between mt-4 mb-6">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>

                <Text className="text-lg font-semibold">Edit Profile</Text>

                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={22} />
                </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="space-y-5">
                {/* Full Name */}
                <View>
                    <Text className="text-gray-500 mb-1">Full Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="border-b border-gray-300 py-2 text-base"
                    />
                </View>

                {/* Email */}
                <View>
                    <Text className="text-gray-500 mb-1">E-mail</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        className="border-b border-gray-300 py-2 text-base"
                    />
                </View>

                {/* Password */}
                {/* <View>
                    <Text className="text-gray-500 mb-1">Password</Text>
                    <View className="flex-row items-center border-b border-gray-300">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secure}
                            className="flex-1 py-2 text-base"
                        />
                        <TouchableOpacity onPress={() => setSecure(!secure)}>
                            <Ionicons
                                name={secure ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                </View> */}

                {/* Location */}
                <View>
                    <Text className="text-gray-500 mb-1">Phone Number</Text>
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        className="border-b border-gray-300 py-2 text-base"
                    />
                </View>
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between mt-10">
                <TouchableOpacity className="border border-gray-300 px-10 py-3 rounded-full">
                    <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="navigate-btn px-10 py-3 rounded-full"
                    onPress={handleUpdateProfile}
                >
                    <Text className="text-white font-medium">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
