
import axios from "axios";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { userAuthentication, updateUser } from "@/store/slices/userSlice";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';

const Login = () => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (!email || !pass) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            const res = await axios.post(`${process.env.EXPO_PUBLIC_USER_API_URL}/api/user/login`, { email: email, password: pass }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            Alert.alert("Success", res.data.message);
            dispatch(userAuthentication(true));
            dispatch(updateUser({
                user: res.data.user,
                token: res.data.token
            }));
            router.replace("/(tabs)/Home");
        } catch (err: any) {
            console.error("Login Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Login failed";
            Alert.alert("Error", errorMessage);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                className="bg-gray-50 px-4"
            >
                <View className="w-full max-w-sm p-6 bg-white rounded-lg shadow-sm">
                    <Text className="text-2xl font-semibold text-center mb-6">Login</Text>

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white text-black"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                    />

                    {/* Password */}
                    <View className="w-full mb-4 border border-gray-300 rounded-md bg-white flex-row items-center px-3">
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={pass}
                            onChangeText={setPass}
                            secureTextEntry={!showPassword}
                            className="flex-1 py-3 text-black"
                        />

                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={22}
                                color="gray"
                            />
                        </Pressable>
                    </View>

                    {/* Login Button */}
                    <Pressable
                        onPress={handleSubmit}
                        className="w-full bg-green-700 py-3 rounded-lg active:bg-green-800"
                    >
                        <Text className="text-white text-center text-lg font-medium">
                            Login
                        </Text>
                    </Pressable>

                    {/* Signup */}
                    <View className="mt-4 flex-row justify-center">
                        <Text>Don't have an account? </Text>
                        <Link href="/auth/signup">
                            <Text className="text-blue-600 font-bold">Sign Up</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Login;
