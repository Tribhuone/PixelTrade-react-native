
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
import axios from "axios";
import { BASE_URL } from '@/constants/api';

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const [pass, setPass] = useState("");
    const [method, setMethod] = useState("");

    const handleSubmit = async () => {
        if (!fullName || !email || !phone || !pass || !method) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const validatePhone = `+91${phone}`;

        try {
            const res = await axios.post(`${process.env.EXPO_PUBLIC_USER_API_URL}/api/user/register`,
                {
                    name: fullName,
                    email: email,
                    phone: validatePhone,
                    password: pass,
                    verificationMethod: method,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            Alert.alert("Success", res.data.message);
            // Navigate to OTP verification - simplifying to Login for now as OTP screen not ready
            // router.push(`/otp-verification/${email}/${phone}`);
            router.replace("/auth/login");
        } catch (err: any) {
            console.error("Registration Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Registration failed";
            Alert.alert("Error", errorMessage);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className="bg-gray-50 px-4 py-10">
            <View className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm">
                <Text className="text-2xl font-semibold text-center mb-5">Register</Text>

                <TextInput
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white"
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View className="flex-row items-center mb-4 border border-gray-300 rounded-md bg-white overflow-hidden">
                    <Text className="px-4 text-gray-700 bg-gray-100 py-3">+91</Text>
                    <TextInput
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        className="flex-1 p-3 bg-white"
                        keyboardType="number-pad"
                    />
                </View>

                <TextInput
                    placeholder="Password"
                    value={pass}
                    onChangeText={setPass}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white"
                    secureTextEntry
                />

                <Text className="text-lg mb-2">Select Verification Method</Text>
                <View className="flex-row gap-6 mb-6">
                    <Pressable onPress={() => setMethod("email")} className="flex-row items-center gap-2">
                        <View className={`w-5 h-5 rounded-full border ${method === 'email' ? 'bg-green-500 border-green-500' : 'border-gray-400'}`} />
                        <Text>Email</Text>
                    </Pressable>
                    <Pressable onPress={() => setMethod("phone")} className="flex-row items-center gap-2">
                        <View className={`w-5 h-5 rounded-full border ${method === 'phone' ? 'bg-green-500 border-green-500' : 'border-gray-400'}`} />
                        <Text>Phone</Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={handleSubmit}
                    className="w-full bg-green-700 py-3 rounded-lg active:bg-green-800"
                >
                    <Text className="text-white text-center text-lg font-medium">Register</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

export default Signup;
