
import axios from "axios";
import { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from "expo-router";

const Signup = () => {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const [pass, setPass] = useState("");
    const [method, setMethod] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (!fullName || !email || !phone || !pass || !method) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const validatePhone = `+91${phone}`;

        try {
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_USER_API_URL}/api/user/register`,
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
            router.replace("/auth/login");
        } catch (err: any) {
            console.error("Registration Error:", err);
            const errorMessage =
                err.response?.data?.message || err.message || "Registration failed";
            Alert.alert("Error", errorMessage);
        }
    };

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
                className="bg-gray-50 px-4 py-10"
            >
                <View className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm">
                    <Text className="text-2xl font-semibold text-center mb-5">
                        Register
                    </Text>

                    <TextInput
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white text-black"
                        placeholderTextColor="#888"
                    />

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white text-black"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />

                    <View className="flex-row items-center mb-4 border border-gray-300 rounded-md bg-white overflow-hidden">
                        <Text className="px-4 text-gray-700 bg-gray-100 py-3">+91</Text>
                        <TextInput
                            placeholder="Phone"
                            value={phone}
                            onChangeText={setPhone}
                            className="flex-1 p-3 bg-white text-black"
                            keyboardType="number-pad"
                            placeholderTextColor="#888"
                        />
                    </View>

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

                    <Text className="text-lg mb-2">Select Verification Method</Text>

                    <View className="flex-row gap-6 mb-6">
                        <Pressable
                            onPress={() => setMethod("email")}
                            className="flex-row items-center gap-2"
                        >
                            <View
                                className={`w-5 h-5 rounded-full border ${method === "email"
                                    ? "bg-[#207B20] border-[#207B20]"
                                    : "border-gray-400"
                                    }`}
                            />
                            <Text className="text-black">Email</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setMethod("phone")}
                            className="flex-row items-center gap-2"
                        >
                            <View
                                className={`w-5 h-5 rounded-full border ${method === "phone"
                                    ? "bg-[#207B20] border-[#207B20]"
                                    : "border-gray-400"
                                    }`}
                            />
                            <Text>Phone</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={handleSubmit}
                        className="w-full bg-green-700 py-3 rounded-lg active:bg-green-800"
                    >
                        <Text className="text-white text-center text-lg font-medium">
                            Register
                        </Text>
                    </Pressable>

                    <View className="mt-4 flex-row justify-center">
                        <Text className="text-black">Already have an account? </Text>
                        <Pressable onPress={() => router.replace("/auth/login")}>
                            <Text className="text-blue-600 font-bold">Login</Text>
                        </Pressable>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Signup;
