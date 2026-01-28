import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter, Link } from "expo-router";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { userAuthentication, updateUser } from "@/store/slices/userSlice";

const Login = () => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

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
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} className="bg-gray-50 px-4">
            <View className="w-full max-w-sm p-6 bg-white rounded-lg shadow-sm">
                <Text className="text-2xl font-semibold text-center mb-6">Login</Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    placeholder="Password"
                    value={pass}
                    onChangeText={setPass}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white"
                    secureTextEntry
                />

                <Pressable onPress={() => router.push("/password/forgot")} className="mb-4">
                    <Text className="text-right text-blue-600">Forgot Password?</Text>
                </Pressable>

                <Pressable
                    onPress={handleSubmit}
                    className="w-full bg-green-700 py-3 rounded-lg active:bg-green-800"
                >
                    <Text className="text-white text-center text-lg font-medium">Login</Text>
                </Pressable>

                <View className="mt-4 flex-row justify-center">
                    <Text>Don't have an account? </Text>
                    <Link href="/auth/signup">
                        <Text className="text-blue-600 font-bold">Sign Up</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}

export default Login;
